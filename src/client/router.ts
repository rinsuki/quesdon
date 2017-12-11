import * as page from "page"
import * as riot from "riot"

import "./tags/pages/index.tag"
import "./tags/pages/login.tag"
import "./tags/pages/user-top.tag"
import "./tags/pages/my-top.tag"
import "./tags/pages/my-questions.tag"
import "./tags/pages/question.tag"
import "./tags/pages/question-latest.tag"
import "./tags/pages/my-followers.tag"
import "./tags/pages/my-settings.tag"

var routes = [
    {path: "/", tag: "page-index"},
    {path: "/login", tag: "page-login"},
    {path: "/@:acct", tag: "page-user-top"},
    {path: "/@:acct/questions/:q_id", tag: "page-question"},
    {path: "/my", tag: "page-my-top"},
    {path: "/my/questions", tag: "page-my-questions"},
    {path: "/my/followers", tag: "page-my-followers"},
    {path: "/my/settings", tag: "page-my-settings"},
    {path: "/latest", tag: "page-question-latest"},
]

routes.forEach(route => {
    page(route.path, ctx => {
        riot.mount("app .root", route.tag, ctx.params)
    })
})

page()