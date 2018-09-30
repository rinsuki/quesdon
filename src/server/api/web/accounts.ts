import * as Koa from "koa"
import * as Router from "koa-router"
import * as mongoose from "mongoose"
import fetch from "node-fetch"
import * as parseLinkHeader from "parse-link-header"
import { Link, Links } from "parse-link-header"
import { QUESTION_TEXT_MAX_LENGTH } from "../../../common/const"
import { BASE_URL, PUSHBULLET_CLIENT_ID, PUSHBULLET_CLIENT_SECRET } from "../../config"
import { Question, User } from "../../db/index"
import { questionLogger } from "../../utils/questionLog"

const router = new Router()

router.get("/verify_credentials", async (ctx) => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    ctx.body = user
})

router.get("/followers", async (ctx) => {
    if (null == /^\d+$/.exec(ctx.query.max_id || "0")) return ctx.throw("max_id is num only", 400)
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    if (user.hostName === "twitter.com") {
        return {max_id: undefined, accounts: []}
    }
    const instanceUrl = "https://" + user!.acct.split("@")[1]
    const myInfo = await fetch(instanceUrl + "/api/v1/accounts/verify_credentials", {
        headers: {
            Authorization: "Bearer " + user!.accessToken,
        },
    }).then((r) => r.json())
    const param = ctx.query.max_id ? "&max_id=" + ctx.query.max_id : ""
    const followersRes = await fetch(
        `${instanceUrl}/api/v1/accounts/${myInfo.id}/followers?limit=80${param}`,
        {
            headers: {
                Authorization: "Bearer " + user!.accessToken,
            },
        },
    )
    var followers: any[] = await followersRes.json()
    followers = followers
        .map((follower) => follower.acct as string)
        .map((acct) => acct.includes("@") ? acct : (acct + "@" + user!.acct.split("@")[1]))
        .map((acct) => acct.toLowerCase())
    const followersObject = await User.find({acctLower: {$in: followers}})
    const max_id = ((parseLinkHeader(followersRes.headers.get("Link")!) || {} as Links).next || {} as Link).max_id
    ctx.body = {
        accounts: followersObject,
        max_id,
    }
})

router.post("/update", async (ctx) => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    user.description = ctx.request.body.fields.description
    user.questionBoxName = ctx.request.body.fields.questionBoxName
    user.allAnon = !!ctx.request.body.fields.allAnon
    user.stopNewQuestion = !!ctx.request.body.fields.stopNewQuestion
    await user.save()
    ctx.body = {status: "ok"}
})

router.get("/id/:id", async (ctx) => {
    const user = await User.findById(ctx.params.id)
    if (!user) return ctx.throw("not found", 404)
    if (user.hostName === "twitter.com") return ctx.throw("not found", 404)
    ctx.body = user
})

router.get("/pushbullet/redirect", async (ctx) => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    ctx.redirect("https://www.pushbullet.com/authorize"
        + "?client_id=" + PUSHBULLET_CLIENT_ID
        + "&redirect_uri=" + encodeURIComponent(BASE_URL + "/api/web/accounts/pushbullet/callback")
        + "&response_type=code"
        + "&scope=everything",
    )
})

router.get("/pushbullet/callback", async (ctx) => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    const res = await fetch("https://api.pushbullet.com/oauth2/token", {
        method: "POST",
        body: JSON.stringify({
            client_id: PUSHBULLET_CLIENT_ID,
            client_secret: PUSHBULLET_CLIENT_SECRET,
            code: ctx.query.code,
            grant_type: "authorization_code",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((r) => r.json())
    if (res.error) {
        return ctx.throw(500, "pushbullet error: " + res.error.message)
    }
    user.pushbulletAccessToken = res.access_token
    await user.save()
    ctx.redirect("/my/settings")
})

router.post("/pushbullet/disconnect", async (ctx) => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    user.pushbulletAccessToken = null
    await user.save()
    ctx.body = {status: "ok"}
})

router.get("/:acct", async (ctx) => {
    if (ctx.params.acct.toLowerCase().endsWith("twitter.com")) return ctx.throw("twitter service is finished.", 404)
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if (!user) return ctx.throw("not found", 404)
    ctx.body = user
})

router.post("/:acct/question", async (ctx) => {
    if (ctx.params.acct.toLowerCase().endsWith("twitter.com")) return ctx.throw("twitter service is finished.", 404)
    const questionString = ctx.request.body.fields.question
    if (questionString.length < 1) return ctx.throw("please input question", 400)
    if (questionString.length > QUESTION_TEXT_MAX_LENGTH) return ctx.throw("too long", 400)
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if (!user) return ctx.throw("not found", 404)
    if (user.stopNewQuestion) return ctx.throw(400, "this user has stopped new question submit")
    const question = new Question()
    question.question = questionString
    question.user = user
    if (ctx.request.body.fields.noAnon) {
        if (user.allAnon) return ctx.throw("all anon", 400)
        if (!ctx.session!.user) return ctx.throw("please login", 403)
        const questionUser = await User.findById(ctx.session!.user)
        if (!questionUser) return ctx.throw("not found", 404)
        question.questionUser = questionUser
    }
    await question.save()
    // logging
    await questionLogger(ctx, question, "create")
    ctx.body = {status: "ok"}
    if (user.pushbulletAccessToken) {
        fetch("https://api.pushbullet.com/v2/pushes", {
            method: "POST",
            body: JSON.stringify({
                type: "link",
                body: "新しい質問です\nQ. " + question.question,
                url: BASE_URL + "/my/questions",
            }),
            headers: {
                "Access-Token": user.pushbulletAccessToken,
                "Content-Type": "application/json",
            },
        })
    }
})

const getAnswers = async (ctx: Koa.Context) => {
    if (ctx.params.acct.toLowerCase().endsWith("twitter.com")) return ctx.throw("twitter service is finished.", 404)
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if (!user) return ctx.throw("not found", 404)
    const questions = await Question.find({
        user,
        answeredAt: {$ne: null},
        isDeleted: {$ne: true},
    }).sort("-answeredAt")
    ctx.body = questions.map((question) => {
        question.user = user
        return question
    })
}

router.get("/:acct/questions", getAnswers)
router.get("/:acct/answers", getAnswers)

export default router
