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
    fetch("https://"+user!.acct.split("@")[1]+"/api/v1/statuses", {
        method: "POST",
        body: JSON.stringify({
            status: "Q. "+question.question + "\nA. " + question.answer + "\n#quesdon "+BASE_URL+"/@"+user!.acct
        }),
        headers: {
            Authorization: "Bearer "+user!.accessToken,
            "Content-Type": "application/json"
        }
    })
})

export default router