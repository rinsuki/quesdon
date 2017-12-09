import * as Koa from "koa"
import * as Router from "koa-router"
import * as Pug from "koa-pug"
import * as koaBody from "koa-body"
import * as session from "koa-session"
import * as koaStatic from "koa-static"
import * as mount from "koa-mount"
import apiRouter from "./api"
import { PORT, REDIS_URL, SECRET_KEY } from "./config";

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
    ctx.render("index.pug")
})

app.use(router.routes())
app.listen(PORT, () => {
    console.log("listen for http://localhost:"+PORT)
})