const fetchDefaults = require("fetch-defaults")

const apiFetch = fetchDefaults(window.fetch, {
    credentials: "include"
})

module.exports = apiFetch