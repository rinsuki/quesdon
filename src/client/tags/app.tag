app
    .all-container
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
        footer.container
            p quesdon は AGPL-3.0で提供されています。
                a(href="https://github.com/rinsuki/quesdon") ソースコード
            p 開発者: 
                a(href="https://mstdn.maud.io/@rinsuki") @rinsuki@mstdn.maud.io
                |  
                a(href="/@rinsuki@mstdn.maud.io") Quesdon
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
    style.
        .all-container{
            min-height: 100vh;
            padding-bottom:6em;
            position:relative;
        }
        footer.container {
            position:absolute;
            bottom:0;
            padding-top: 1em;
        }