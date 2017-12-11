import * as Router from "koa-router"
import oauthRouter from "./oauth"
import accountsRouter from "./accounts"
import questionsRouter from "./questions"
import bottlesRouter from "./bottles"

var router = new Router

router.use("/oauth", oauthRouter.routes())
router.use("/accounts", accountsRouter.routes())
router.use("/questions", questionsRouter.routes())
router.use("/bottles", bottlesRouter.routes())

router.get("/logout", async ctx => {
    ctx.session!.user = undefined
    ctx.body = {status: "ok"}
})

export default router