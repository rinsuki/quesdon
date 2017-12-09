import * as page from "page"
import * as riot from "riot"

import "./tags/pages/index.tag"
import "./tags/pages/login.tag"
import "./tags/pages/user-top.tag"
import "./tags/pages/my-top.tag"
import "./tags/pages/my-questions.tag"

var routes = [
    {path: "/", tag: "page-index"},
    {path: "/login", tag: "page-login"},
    {path: "/@:acct", tag: "page-user-top"},
    {path: "/my", tag: "page-my-top"},
    {path: "/my/questions", tag: "page-my-questions"},
]

routes.forEach(route => {
    page(route.path, ctx => {
        riot.mount("app .root", route.tag, ctx.params)
    })
})

page()