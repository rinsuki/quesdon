import * as Router from "koa-router"
import webRouter from "./web"

const router = new Router()

router.use("/web", webRouter.routes())

export default router
