import * as riot from "riot"
import "./tags/app.tag"
import "./ctrl-enter.ts"
(<any>window).XDate = require("xdate")

addEventListener("load", () => {
    riot.mount("app")
})
