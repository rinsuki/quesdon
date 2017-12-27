import * as Router from "koa-router"
import * as mongoose from "mongoose"
import { User, Question, IMastodonApp, QuestionLike, IUser } from "../../db/index";
import fetch from "node-fetch";
import { BASE_URL } from "../../config";

var router = new Router

router.get("/", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const questions = await Question.find({
        user: mongoose.Types.ObjectId(ctx.session!.user),
        answeredAt: null,
        isDeleted: {$ne: true}
    })
    console.log(questions)
    ctx.body = JSON.stringify(questions)
})

router.get("/count", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const count = await Question.find({
        user: mongoose.Types.ObjectId(ctx.session!.user),
        answeredAt: null,
        isDeleted: {$ne: true}
    }).count()
    ctx.body = {count}
})

router.get("/latest", async ctx => {
    const questions = await Question.find({
        answeredAt: {$ne: null},
        isDeleted: {$ne: true}
    }).limit(20).sort("-answeredAt")
    ctx.body = questions
})

router.post("/:id/answer", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (question.isDeleted) return ctx.throw("not found", 404)
    if (question.user._id != ctx.session!.user) return ctx.throw("not found", 404)
    if (question.answeredAt) return ctx.throw("alread answered", 400)
    question.answer = ctx.request.body.fields.answer
    if (question.answer!.length < 1) return ctx.throw("please input answer", 400)
    question.answeredAt = new Date()
    if (ctx.request.body.fields.isNSFW) question.isNSFW = true
    await question.save()
    ctx.body = {status: "ok"}
    const user = await User.findById(ctx.session!.user)
    if (!~["public","unlisted","private"].indexOf(ctx.request.body.fields.visibility)) return
    var body = {
        spoiler_text: "Q. "+question.question + " #quesdon",
        status: "A. " + (question.answer!.length > 200 ? question.answer!.substring(0,200) + "...(続きはリンク先で)" : question.answer) + "\n#quesdon "+BASE_URL+"/@"+user!.acct+"/questions/"+question.id,
        visibility: ctx.request.body.fields.visibility
    }
    if (question.questionUser) {
        body.status = "質問者: @"+question.questionUser.acct + "\n" + body.status
    }
    if (question.isNSFW) {
        body.status = "Q. "+question.question + "\n" + body.status
        body.spoiler_text = "⚠ この質問は回答者がNSFWであると申告しています #quesdon"
    }
    fetch("https://"+user!.acct.split("@")[1]+"/api/v1/statuses", {
        method: "POST",
        body: JSON.stringify(body),
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
    question.isDeleted = true
    await question.save()
    ctx.body = {status: "ok"}
})

router.post("/:id/like", async ctx => {
    if(!ctx.session!.user) return ctx.throw("please login", 403)
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (!question.answeredAt) return ctx.throw("not found", 404)
    if (await QuestionLike.findOne({question})) return ctx.throw("already liked", 400)
    const like = new QuestionLike
    like.question = question
    like.user = mongoose.Types.ObjectId(ctx.session!.user)
    await like.save()
    question.likesCount = await QuestionLike.find({question}).count()
    await question.save()
    ctx.body = {status: "ok"}
})

router.post("/:id/unlike", async ctx => {
    if(!ctx.session!.user) return ctx.throw("please login", 403)
    const question = await Question.findById(ctx.params.id)
    const user = mongoose.Types.ObjectId(ctx.session!.user)
    if (!question) return ctx.throw("not found", 404)
    if (!question.answeredAt) return ctx.throw("not found", 404)
    const like = await QuestionLike.findOne({question, user})
    if (!like) return ctx.throw("not liked", 400)
    await like.remove()
    question.likesCount = await QuestionLike.find({question}).count()
    await question.save()
    ctx.body = {status: "ok"}
})



router.get("/:id", async ctx => {
    const question = await Question.findById(ctx.params.id)
    if (!question) return ctx.throw("not found", 404)
    if (!question.answeredAt) return ctx.throw("not found", 404)
    if (question.isDeleted) return ctx.throw("not found", 404)
    ctx.body = question
})

router.post("/all_delete", async ctx => {
    if(!ctx.session!.user) return ctx.throw("please login", 403)
    await Question.update({
        user: mongoose.Types.ObjectId(ctx.session!.user)
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        multi: true
    })
    ctx.body = {status: "ok"}
})

export default router