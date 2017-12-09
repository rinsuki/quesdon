page-my-top
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h1 マイページ
        p こんにちは、{user.name}さん!
        ul
            li: a(href="/@{user.acct}") あなたのプロフィール
            li: a(href="/my/questions") あなた宛ての質問
    script.
        import "../loading.tag"
        apiFetch("/api/web/accounts/verify_credentials").then(r => r.json()).then(r => {
            this.user = r
            this.loaded = true
            this.update()
        })