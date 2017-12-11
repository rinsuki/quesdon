import * as Router from "koa-router"
import * as mongoose from "mongoose"
import { Bottle, Question, User } from "../../db/index";
import fetch from "node-fetch";
import { BASE_URL } from "../../config";

var router = new Router

router.post("/new", async ctx => {
    const questionString = ctx.request.body.fields.question
    if (questionString.length > 200) return ctx.throw("too long", 400)
    const bottle = new Bottle
    bottle.question = questionString
    await bottle.save()
    ctx.body = {status: "ok"}
})

router.get("/gacha", async ctx => {
    var usingAll = false
    var count = await Bottle.find({usedCounter: {$lte: 3}}).count()
    if (count <= 2) {
        count = await Bottle.find().count()
        usingAll = true
    }
    var query: any = usingAll ? {} : {usedCounter: {$lte: 3}}
    if(ctx.query.other && /^[0-9a-f]{24}$/.test(ctx.query.other) && count > 1) {
        query._id = {$ne: ctx.query.other}
        count--
    }
    const random = Math.floor(Math.random() * count)
    ctx.body = await Bottle.findOne(query).skip(random)
})

router.post("/:id/answer", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const bottle = await Bottle.findById(ctx.params.id)
    if (!bottle) return ctx.throw("not found", 404)
    // if (bottle.answeredAt) return ctx.throw("alread answered", 400)
    const user = await User.findById(ctx.session!.user)
    const question = new Question
    question.user = user!._id
    question.question = bottle.question
    question.answer = ctx.request.body.fields.answer
    question.answeredAt = new Date()
    question.bottle = bottle._id
    await question.save()
    bottle.usedCount++
    bottle.answers.push(question._id)
    await bottle.save()
    ctx.body = {status: "ok"}
    if (!~["public","unlisted","private"].indexOf(ctx.request.body.fields.visibility)) return
    fetch("https://"+user!.acct.split("@")[1]+"/api/v1/statuses", {
        method: "POST",
        body: JSON.stringify({
            spoiler_text: "Q. "+question.question + " #quesdon_bottle",
            status: "A. " + (question.answer!.length > 200 ? question.answer!.substring(0,200) + "...(続きはリンク先で)" : question.answer) + "\n#quesdon #quesdon_bottle "+BASE_URL+"/@"+user!.acct+"/Bottles/"+question.id,
            visibility: ctx.request.body.fields.visibility
        }),
        headers: {
            Authorization: "Bearer "+user!.accessToken,
            "Content-Type": "application/json"
        }
    })
})


export default router