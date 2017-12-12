app
    .all-container
        nav.navbar.navbar-light.bg-light.navbar-expand-sm
            .container
                a.navbar-brand(href="/") Quesdon
                button.navbar-toggler(type="button", data-toggle="collapse", data-target="app .collapse")
                    span.navbar-toggler-icon
                .collapse.navbar-collapse
                    ul.navbar-nav.mr-auto
                        li.nav-item(if="{login}"): a.nav-link(href="/my") @{window.USER.acct}
                        li.nav-item(if="{!login}"): a.nav-link(href="/login") ログイン
        .container.body-container
            .root
        footer.container
            p quesdon は AGPL-3.0で提供されています。
                a(href="https://github.com/rinsuki/quesdon") ソースコード
            p 開発者: 
                a(href="https://mstdn.maud.io/@rinsuki") @rinsuki@mstdn.maud.io
                |  
                a(href="/@rinsuki@mstdn.maud.io") Quesdon(要望などもこちらへ)
    script.
        this.on("mount", () => {
            require("../router.ts")
        })
        this.login = !!window.USER
    style.
        .all-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .body-container {
            flex: 1 0 auto;
        }