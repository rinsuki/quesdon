import * as Router from "koa-router"
import webRouter from "./web"

var router = new Router

router.use("/web", webRouter.routes())

export default router