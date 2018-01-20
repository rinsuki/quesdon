import * as Router from "koa-router"
import { MastodonApp, User } from "../../db/index"
import fetch from "node-fetch"
import { BASE_URL } from "../../config";
import rndstr from "rndstr"
import requestOAuth from "../../utils/requestOAuth";
import QueryStringUtils from "../../utils/queryString"
import twitterClient from "../../utils/twitterClient"

var router = new Router

router.post("/get_url", async ctx => {
    const hostName = ctx.request.body.fields.instance
        .replace(/.*@/, "").toLowerCase()
    if(~hostName.indexOf("/")) return ctx.reject(400, "not use slash in hostname")
    const redirectUri = BASE_URL+"/api/web/oauth/redirect"
    var url = ""
    if (hostName !== "twitter.com") { // Mastodon
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
            ctx.session!.loginState = rndstr()+"_"+app.id
            url = `https://${app.hostName}/oauth/authorize?client_id=${app.clientId}&scope=read+write&redirect_uri=${redirectUri}&response_type=code&state=${ctx.session!.loginState}`
        }
    } else { // Twitter
        ctx.session!.loginState = "twitter"
        const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env
        if (TWITTER_CONSUMER_KEY == null || TWITTER_CONSUMER_SECRET == null) {
            ctx.throw(500, "twitter not supported in this server.")
        }
        const requestTokenRes = await requestOAuth(twitterClient, {
            url: "https://api.twitter.com/oauth/request_token",
            method: "POST",
            data: {}
        }).then(r => r.text()).then(r => QueryStringUtils.decode(r))
        console.log(requestTokenRes)
        var requestToken = {
            token: requestTokenRes.oauth_token,
            secret: requestTokenRes.oauth_token_secret
        }
        ctx.session!.twitterOAuth = requestToken
        url = `https://twitter.com/oauth/authorize?oauth_token=${requestToken.token}`
    }
    ctx.body = {
        url
    }
})

router.get("/redirect", async ctx => {
    console.log(ctx.session)
    var profile: {
        id: string
        name: string
        screenName: string
        avatarUrl: string
        accessToken: string
        hostName: string
        url: string
        acct: string
    }
    if (ctx.session!.loginState != "twitter") {
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
        profile = {
            id: myProfile.id,
            name: myProfile.display_name || myProfile.username,
            screenName: myProfile.username,
            hostName: app.hostName,
            avatarUrl: myProfile.avatar_static,
            accessToken: res.access_token,
            url: myProfile.url,
            acct: myProfile.display_name + "@" + app.hostName,
        }
    } else { // twitter
        const requestToken: {
            token: string
            secret: string
        } | undefined = ctx.session!.twitterOAuth
        if (!requestToken) return ctx.redirect("/login?error=no_request_token")
        if (requestToken.token != ctx.query.oauth_token) return ctx.redirect("/login?error=invalid_request_token")
        var accessToken
        try {
            const accessTokenRes = await requestOAuth(twitterClient, {
                url: "https://api.twitter.com/oauth/access_token",
                method: "POST",
                data: {oauth_verifier: ctx.query.oauth_verifier}
            }, {
                key: requestToken.token,
                secret: requestToken.secret,
            }).then(r => r.text()).then(r => QueryStringUtils.decode(r))
            accessToken = {
                key: accessTokenRes.oauth_token,
                secret: accessTokenRes.oauth_token_secret
            }
        } catch(e) {
            return ctx.redirect("/login?error=failed_access_token_fetch")
        }
        var a
        try {
            a = await requestOAuth(twitterClient, {
                url: "https://api.twitter.com/1.1/account/verify_credentials.json",
                method: "GET",
                data: {}
            }, accessToken).then(r => r.json())
        } catch(e) {
            return ctx.redirect("/login?error=failed_user_profile_fetch")
        }
        profile = {
            id: a.id_str,
            name: a.name,
            screenName: a.screen_name,
            hostName: "twitter.com",
            avatarUrl: a.profile_image_url_https.replace("_normal.", "_400x400."),
            accessToken: accessToken.key+":"+accessToken.secret,
            url: "https://twitter.com/"+a.screen_name,
            acct: a.screen_name+":"+a.id_str+"@twitter.com",
        }
    }
    if (!profile) return
    const acct = profile.acct
    var user
    if (profile.hostName != "twitter.com") { // Mastodon
        user = await User.findOne({acctLower: acct.toLowerCase()})
    } else {
        user = await User.findOne({upstreamId: profile.id, hostName: profile.hostName})
    }
    if (user == null) {
        user = new User
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