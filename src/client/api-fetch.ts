const fetchDefaults = require("fetch-defaults")

export default function apiFetch(url: string, params?: RequestInit) {
    if (!params) params = {}
    params = Object.assign({
        credentials: "include",
        headers: {
            "X-CSRF-Token": (<any>window).CSRF_TOKEN
        }
    }, params)
    return window.fetch(url, params)
}