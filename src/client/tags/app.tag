app
    .all-container
        nav.navbar.navbar-light.bg-light.navbar-expand-sm.mb-2
            .container
                a.navbar-brand(href="/") Quesdon
                button.navbar-toggler(type="button", data-toggle="collapse", data-target="app .collapse")
                    span.navbar-toggler-icon
                .collapse.navbar-collapse
                    ul.navbar-nav.mr-auto
                        li.nav-item(if="{login}"): a.nav-link(href="/my") @{window.USER.acct}
                            span.ml-1.badge.badge-pill.badge-secondary(if="{count}") {count}
                        li.nav-item(if="{!login}"): a.nav-link(href="/login") ログイン
        .container.body-container
            .alert.alert-info(if="{!isHideOfficialAccountNotifyAlert}")
                p: strong Quesdon公式アカウント(@quesdon@mstdn.jp)ができました!
                p 新機能の実装や不具合の修正、サービスの障害などについてトゥートする予定です。
                p よろしければフォローしてやってください。
                a(href="https://mstdn.jp/@quesdon").btn.btn-primary プロフィールを見に行く
                button(onclick="{hideOfficialAccountNotifyAlert}").btn.btn-secondary この通知を隠す
            .root
        footer.container
            p quesdon は AGPL-3.0で提供されています。
                a(href="https://github.com/rinsuki/quesdon") ソースコード
            p 公式アカウント: 
                a(href="https://mstdn.jp/@quesdon") @quesdon@mstdn.jp
                |  
                a(href="/@quesdon@mstdn.jp") 公式Quesdon (要望や不具合報告などもこちらへどうぞ)
            p 開発者: 
                a(href="https://mstdn.maud.io/@rinsuki") @rinsuki@mstdn.maud.io
    script.
        this.on("mount", () => {
            require("../router.ts")
        })
        this.hideOfficialAccountNotifyAlert = () => {
            localStorage.setItem("hideOfficialAccountNotifyAlert", "1")
            this.isHideOfficialAccountNotifyAlert = true
            this.update()
        }
        this.isHideOfficialAccountNotifyAlert = localStorage.getItem("hideOfficialAccountNotifyAlert")
        this.login = !!window.USER
        this.updateQuestionCount = () => {
            apiFetch("/api/web/questions/count").then(r => r.json()).then(r => {
                this.count = r.count
                this.update()
            })
        }
        this.updateQuestionCount()
        setInterval(this.updateQuestionCount, 1 * 60 * 1000)
    style.
        .all-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .body-container {
            flex: 1 0 auto;
        }