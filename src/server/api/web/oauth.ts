import * as Router from "koa-router"
import fetch from "node-fetch"
import rndstr from "rndstr"
import { URL } from "url"
import { BASE_URL } from "../../config"
import { MastodonApp, User } from "../../db/index"
import QueryStringUtils from "../../utils/queryString"
import { requestOAuth } from "../../utils/requestOAuth"
import twitterClient from "../../utils/twitterClient"

const router = new Router()

router.post("/get_url", async (ctx) => {
    const hostName = ctx.request.body.fields.instance
        .replace(/.*@/, "").toLowerCase()
    if (hostName.includes("/")) return ctx.reject(400, "not use slash in hostname")
    const redirectUri = BASE_URL + "/api/web/oauth/redirect"
    var url = ""
    if (hostName !== "twitter.com") { // Mastodon
        var app = await MastodonApp.findOne({hostName, appBaseUrl: BASE_URL, redirectUri})
        if (!app) {
            const res = await fetch("https://" + hostName + "/api/v1/apps", {
                method: "POST",
                body: JSON.stringify({
                    client_name: "Quesdon",
                    redirect_uris: redirectUri,
                    scopes: "read write",
                    website: BASE_URL,
                }),
                headers: {"Content-Type": "application/json"},
            }).then((r) => r.json())
            app = new MastodonApp()
            app.clientId = res.client_id
            app.clientSecret = res.client_secret
            app.hostName = hostName
            app.appBaseUrl = BASE_URL
            app.redirectUri = redirectUri
            await app.save()
        }
        ctx.session!.loginState = rndstr() + "_" + app.id
        const params: {[key: string]: string} = {
            client_id: app.clientId,
            scope: "read+write",
            redirect_uri: redirectUri,
            response_type: "code",
            state: ctx.session!.loginState,
        }
        url = `https://${app.hostName}/oauth/authorize?${Object.entries(params).map((v) => v.join("=")).join("&")}`
    } else { // Twitter
        return ctx.throw("twitter service is finished.", 404)
    }
    ctx.body = {
        url,
    }
})

router.get("/redirect", async (ctx) => {
    var profile: {
        id: string
        name: string
        screenName: string
        avatarUrl: string
        accessToken: string
        hostName: string
        url: string
        acct: string,
    }
    if (ctx.session!.loginState !== "twitter") {
        if (ctx.query.state !== ctx.session!.loginState) {
            ctx.redirect("/login?error=invalid_state")
            return
        }
        const app = await MastodonApp.findById(ctx.session!.loginState.split("_")[1])
        if (app == null) {
            ctx.redirect("/login?error=app_notfound")
            return
        }
        const res = await fetch("https://" + app.hostName + "/oauth/token", {
            method: "POST",
            body: JSON.stringify({
                grant_type: "authorization_code",
                redirect_uri: app.redirectUri,
                client_id: app.clientId,
                client_secret: app.clientSecret,
                code: ctx.query.code,
                state: ctx.query.state,
            }),
            headers: {"Content-Type": "application/json"},
        }).then((r) => r.json())
        const myProfile = await fetch("https://" + app.hostName + "/api/v1/accounts/verify_credentials",  {
            headers: {Authorization: "Bearer " + res.access_token},
        }).then((r) => r.json())
        profile = {
            id: myProfile.id,
            name: myProfile.display_name || myProfile.username,
            screenName: myProfile.username,
            hostName: app.hostName,
            avatarUrl: myProfile.avatar_static,
            accessToken: res.access_token,
            url: myProfile.url,
            acct: myProfile.username + "@" + app.hostName,
        }
    } else { // twitter
        return ctx.throw("twitter service is finished", 404)
    }
    if (!profile) return
    const acct = profile.acct
    var user
    if (profile.hostName !== "twitter.com") { // Mastodon
        user = await User.findOne({acctLower: acct.toLowerCase()})
    } else {
        user = await User.findOne({upstreamId: profile.id, hostName: profile.hostName})
    }
    if (user == null) {
        user = new User()
    }
    user.acct = acct
    user.acctLower = acct.toLowerCase()
    user.name = profile.name
    user.avatarUrl = profile.avatarUrl
    user.accessToken = profile.accessToken
    user.hostName = profile.hostName
    user.url = profile.url
    user.upstreamId = profile.id
    await user.save()
    ctx.session!.user = user.id
    ctx.redirect("/my")
})

export default router
