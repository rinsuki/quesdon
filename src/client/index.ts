import * as React from "react"
import * as ReactDOM from "react-dom"

import App from "./components/app"
import APIUser from "../api-interface/APIUser";

// --- bootstrap init ---
if (localStorage.getItem("using-dark-theme")) {
    require("./bootstrap-darkly.min.css")
} else {
    require("bootstrap/dist/css/bootstrap.min.css")
}
import "./style.css"
import "jquery"
(<any>window).Popper = require("popper.js")
import "bootstrap/dist/js/bootstrap.min.js"
// ---

addEventListener("DOMContentLoaded", () => {
    var root = document.getElementById("root")
    ReactDOM.render(React.createElement(App, {
        userInfo: <APIUser | undefined>(<any>window).USER
    }), root)
})