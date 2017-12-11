import * as Router from "koa-router"
import * as mongoose from "mongoose"
import { User, Question, IMastodonApp } from "../../db/index";
import fetch from "node-fetch";
import { BASE_URL } from "../../config";

var router = new Router

router.get("/", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const questions = await Question.find({
        user: mongoose.Types.ObjectId(ctx.session!.user),
        answeredAt: null
    })
    console.log(questions)
    ctx.body = JSON.stringify(questions)
})

router.get("/latest", async ctx => {
    const questions = await Question.find({
        answeredAt: {$ne: null}
    }).limit(20).sort("-answeredAt").populate("user")
    ctx.body = questions
})

router.post("/:id/answer", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (question.user.toString() != ctx.session!.user) return ctx.throw("not found", 404)
    if (question.answeredAt) return ctx.throw("alread answered", 400)
    question.answer = ctx.request.body.fields.answer
    question.answeredAt = new Date()
    await question.save()
    ctx.body = {status: "ok"}
    const user = await User.findById(ctx.session!.user)
    if (!~["public","unlisted","private"].indexOf(ctx.request.body.fields.visibility)) return
    fetch("https://"+user!.acct.split("@")[1]+"/api/v1/statuses", {
        method: "POST",
        body: JSON.stringify({
            spoiler_text: "Q. "+question.question + " #quesdon",
            status: "A. " + (question.answer!.length > 200 ? question.answer!.substring(0,200) + "...(続きはリンク先で)" : question.answer) + "\n#quesdon "+BASE_URL+"/@"+user!.acct+"/questions/"+question.id,
            visibility: ctx.request.body.fields.visibility
        }),
        headers: {
            Authorization: "Bearer "+user!.accessToken,
            "Content-Type": "application/json"
        }
    })
})

router.post("/:id/delete", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (question.user.toString() != ctx.session!.user) return ctx.throw("not found", 404)
    await question.remove()
    ctx.body = {status: "ok"}
})

router.get("/:id", async ctx => {
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (!question.answeredAt) return ctx.throw("not found", 404)
    ctx.body = question
})

export default router