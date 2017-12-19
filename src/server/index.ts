import * as Koa from "koa"
import * as Router from "koa-router"
import * as Pug from "koa-pug"
import * as koaBody from "koa-body"
import * as session from "koa-session"
import * as koaStatic from "koa-static"
import * as mount from "koa-mount"
import rndstr from "rndstr"
import apiRouter from "./api"
import { PORT, SECRET_KEY, GIT_COMMIT } from "./config";
import { User } from "./db/index";

const app = new Koa

app.keys = [SECRET_KEY]

new Pug({
    viewPath: __dirname+"/views"
}).use(app)
app.use(koaBody({
    multipart: true
}))
app.use(session({
}, app))

app.use(mount("/assets", koaStatic(__dirname+"/../client")))

const router = new Router

router.use("/api", apiRouter.routes())

router.get("/*", async ctx => {
    var user
    if (ctx.session!.user) {
        user = await User.findById(ctx.session!.user)
        user = JSON.stringify(user).replace(/[\u0080-\uFFFF]/g, chr => {
            return "\\u"+("0000"+chr.charCodeAt(0).toString(16)).substr(-4)
        })
        user = new Buffer(user, "binary").toString("base64")
    }
    if (!ctx.session!.csrfToken) {
        ctx.session!.csrfToken = rndstr()
    }
    ctx.render("index.pug", {
        GIT_COMMIT,
        user,
        csrfToken: ctx.session!.csrfToken
    })
})

app.use(router.routes())
app.listen(PORT, () => {
    console.log("listen for http://localhost:"+PORT)
})