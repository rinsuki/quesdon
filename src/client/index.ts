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
import "bootstrap/dist/js/bootstrap.min.js"
import "./style.css"
// ---

import "./ctrl-enter"

addEventListener("DOMContentLoaded", () => {
    const devBuildMessage = document.getElementById("webpackDevBuildMessage")
    if (process.env.NODE_ENV !== "production" && devBuildMessage) {
        devBuildMessage.style.display = "block"
    }

    const root = document.getElementById("root")
    ReactDOM.render(React.createElement(App), root)
})
