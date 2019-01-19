import * as Koa from "koa"
import * as koaBody from "koa-body"
import * as mount from "koa-mount"
import * as Pug from "koa-pug"
import * as Router from "koa-router"
import * as session from "koa-session"
import * as path from "path"
import rndstr from "rndstr"
import apiRouter from "./api"
import { GIT_COMMIT, PORT, SECRET_KEY } from "./config"
import { User } from "./db/index"

const app = new Koa()

app.keys = [SECRET_KEY]

new Pug({
    viewPath: path.join(__dirname, "../../views"),
}).use(app)
app.use(koaBody({
    multipart: true,
}))
app.use(session({
}, app))

// tslint:disable-next-line:no-var-requires
app.use(mount("/assets", require("koa-static-cache")(__dirname + "/../client")))

const router = new Router()

router.use("/api", apiRouter.routes())

router.get("/*", async (ctx) => {
    var user
    if (ctx.session!.user) {
        user = await User.findById(ctx.session!.user)
        user = JSON.stringify(user).replace(/[\u0080-\uFFFF]/g, (chr) => {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        })
        user = new Buffer(user, "binary").toString("base64")
    }
    if (!ctx.session!.csrfToken) {
        ctx.session!.csrfToken = rndstr()
    }
    ctx.render("index.pug", {
        GIT_COMMIT,
        user,
        csrfToken: ctx.session!.csrfToken,
        isProduction: app.env === "production",
    })
})

app.use(router.routes())
app.listen(PORT, () => {
    console.log("listen for http://localhost:" + PORT)
})
