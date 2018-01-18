page-my-top
    title マイページ - Quesdon
    h1 マイページ
    p こんにちは、{window.USER.name}さん!
    ul
        li: a(href="/@{window.USER.acct}") あなたのプロフィール
        li: a(href="/my/questions") あなた宛ての質問
            span.ml-1.badge.badge-pill.badge-secondary(if="{count}") {count}
        li: a(href="/my/followers") フォロワーのQuesdon利用者
        li: a(href="/my/settings") 設定
        li: a(href="#",onclick="{logout}") ログアウト
    script.
        this.logout = e => {
            e.preventDefault()
            if(!confirm("ログアウトしていい?")) return
            apiFetch("/api/web/logout").then(r => r.json()).then(r => {
                location.pathname = "/"
            })
        }
        apiFetch("/api/web/questions/count").then(r => r.json()).then(r => {
            this.count = r.count
            this.update()
        })