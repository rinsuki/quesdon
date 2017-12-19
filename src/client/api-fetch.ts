const fetchDefaults = require("fetch-defaults")

const apiFetch = fetchDefaults(window.fetch, {
    credentials: "include",
    headers: {
        "X-CSRF-Token": (<any>window).CSRF_TOKEN
    }
})

module.exports = apiFetch