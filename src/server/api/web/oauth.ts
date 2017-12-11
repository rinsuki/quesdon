import * as Router from "koa-router"
import { MastodonApp, User } from "../../db/index"
import fetch from "node-fetch"
import { BASE_URL } from "../../config";
import rndstr from "rndstr"

var router = new Router

router.post("/get_url", async ctx => {
    const hostName = ctx.request.body.fields.instance
        .replace(/.*@/, "")
    if(~hostName.indexOf("/")) return ctx.reject(400, "not use slash in hostname")
    const redirectUri = BASE_URL+"/api/web/oauth/redirect"
    var app = await MastodonApp.findOne({hostName, appBaseUrl: BASE_URL, redirectUri})
    if (!app) {
        const res = await fetch("https://"+hostName+"/api/v1/apps", {
            method: "POST",
            body: JSON.stringify({
                client_name: "Quesdon",
                redirect_uris: redirectUri,
                scopes: "read write",
                website: BASE_URL
            }),
            headers: {"Content-Type": "application/json"}
        }).then(r => r.json())
        app = new MastodonApp
        app.clientId = res.client_id
        app.clientSecret = res.client_secret
        app.hostName = hostName
        app.appBaseUrl = BASE_URL
        app.redirectUri = redirectUri
        await app.save()
    }
    ctx.session!.loginState = rndstr()+"_"+app.id
    ctx.body = {
        url: `https://${app.hostName}/oauth/authorize?client_id=${app.clientId}&scope=read+write&redirect_uri=${redirectUri}&response_type=code&state=${ctx.session!.loginState}`
    }
})

router.get("/redirect", async ctx => {
    console.log(ctx.session)
    if (ctx.query.state != ctx.session!.loginState) {
        ctx.redirect("/login?error=invalid_state")
        return
    }
    const app = await MastodonApp.findById(ctx.session!.loginState.split("_")[1])
    if (app == null) {
        ctx.redirect("/login?error=app_notfound")
        return
    }
    const res = await fetch("https://"+app.hostName+"/oauth/token", {
        method: "POST",
        body: JSON.stringify({
            grant_type: "authorization_code",
            redirect_uri: app.redirectUri,
            client_id: app.clientId,
            client_secret: app.clientSecret,
            code: ctx.query.code,
            state: ctx.query.state
        }),
        headers: {"Content-Type": "application/json"}
    }).then(r => r.json())
    console.log(res)
    const myProfile = await fetch("https://"+app.hostName+"/api/v1/accounts/verify_credentials",  {
        headers: {"Authorization": "Bearer "+res.access_token}
    }).then(r => r.json())
    console.log(myProfile)
    const acct = myProfile.username + "@" + app.hostName
    var user = await User.findOne({acctLower: acct.toLowerCase()})
    if (user == null) {
        user = new User
        user.acct = acct
        user.acctLower = acct.toLowerCase()
        user.app = app
    }
    user.name = myProfile.display_name || myProfile.username
    user.avatarUrl = myProfile.avatar_static
    user.accessToken = res.access_token
    await user.save()
    ctx.session!.user = user.id
    ctx.redirect("/my")
})

export default router