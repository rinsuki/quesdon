app
    nav.navbar.navbar-light.bg-light.navbar-expand-sm
        .container
            a.navbar-brand(href="/") Quesdon
            button.navbar-toggler(type="button", data-toggle="collapse", data-target="app .collapse")
                span.navbar-toggler-icon
            .collapse.navbar-collapse
                ul.navbar-nav.mr-auto
                    li.nav-item(if="{login}"): a.nav-link(href="/my") @{user.acct}
                    li.nav-item(if="{!login}"): a.nav-link(href="/login") ログイン
    .container
        .root
    script.
        this.on("mount", () => {
            require("../router.ts")
        })
        apiFetch("/api/web/accounts/verify_credentials").then(async r => {
            if (r.status == 200) {
                this.login = true
                this.user = await r.json()
            } else {
                this.login = false
            }
            this.update()
        })
