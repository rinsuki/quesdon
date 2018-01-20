import { csrfToken } from "./initial-state";

const fetchDefaults = require("fetch-defaults")

export default function apiFetch(url: string, params?: RequestInit) {
    if (!params) params = {}
    params = Object.assign({
        credentials: "include",
        headers: {
            "X-CSRF-Token": csrfToken
        }
    }, params)
    return window.fetch(url, params)
}