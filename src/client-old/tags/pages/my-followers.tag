page-my-followers
    title フォロワーのQuesdon利用者一覧 - マイページ - Quesdon
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h1 フォロワーのQuesdon利用者一覧
        ul
            li(each="{account in accounts}")
                a(href="/@{account.acct}") {account.name}
                    span.text-muted  @{account.acct}
        button(disabled="{!(loaded && !next_loading && max_id)}",onclick="{more}") もっと
        script.
            apiFetch("/api/web/accounts/followers").then(r => r.json()).then(r => {
                this.accounts = r.accounts
                this.max_id = r.max_id
                this.loaded = true
                this.update()
            })
            this.more = () => {
                this.next_loading = true
                apiFetch("/api/web/accounts/followers?max_id="+this.max_id).then(r => r.json()).then(r => {
                    this.accounts = this.accounts.concat(r.accounts)
                    this.max_id = r.max_id
                    this.next_loading = false
                    this.update()
                })
            }