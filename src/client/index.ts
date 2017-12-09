import * as riot from "riot"
import "./tags/app.tag"
import "bootstrap/dist/css/bootstrap.min.css"
import "jquery"
(<any>window).Popper = require("popper.js")
import "bootstrap/dist/js/bootstrap.min.js"

addEventListener("load", () => {
    riot.mount("app")
})