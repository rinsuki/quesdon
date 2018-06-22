import * as React from "react"
import * as ReactDOM from "react-dom"

import { APIUser } from "../api-interfaces"
import { App } from "./components/app"

// --- bootstrap init ---
if (localStorage.getItem("using-dark-theme")) {
    // tslint:disable-next-line:no-var-requires
    require("bootswatch/dist/darkly/bootstrap.min.css")
} else {
    // tslint:disable-next-line:no-var-requires
    require("bootstrap/dist/css/bootstrap.min.css")
}
import "jquery"
import "./style.css"
// tslint:disable-next-line:no-var-requires
(window as any).Popper = require("popper.js")
import "bootstrap/dist/js/bootstrap.min.js"
// ---

import "./ctrl-enter"

addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root")
    ReactDOM.render(React.createElement(App), root)
})
