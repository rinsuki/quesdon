import { csrfToken } from "./initial-state"

export function apiFetch(url: string, params?: RequestInit) {
    if (!params) params = {}
    params = Object.assign({
        credentials: "include",
        headers: {
            "X-CSRF-Token": csrfToken,
        },
    }, params)
    return window.fetch(url, params)
}
