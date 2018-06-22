import fetch, { Response } from "node-fetch"
import * as OAuth from "oauth-1.0a"
import QueryStringUtils from "./queryString"

export function requestOAuth(oauth: OAuth, options: OAuth.RequestOptions, token?: OAuth.Token) {
    const opt = {
        url: options.url,
        method: options.method,
        body: QueryStringUtils.encode(options.data),
        headers: {
            ...oauth.toHeader(oauth.authorize(options, token)),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    if (options.method === "GET") {
        opt.url += "?" + opt.body
        delete opt.body
        delete opt.headers["Content-Type"]
    }
    return fetch(opt.url, opt).then((r) => {
        if (!r.ok) {
            return r.text().then((text) => {
                throw new Error("API Error: " + text)
            }) as Promise<Response>
        }
        return Promise.resolve(r)
    })
}
