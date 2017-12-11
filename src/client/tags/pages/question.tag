page-question
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        title Q. {question.question} - {user.name}さんの質問箱 - Quesdon
        .card: .card-body
            h2.card-title {question.question}
            h6.card-subtitle.mb-2
                | 回答者: 
                span(if="{!user_loaded}") 読み込み中...
                a(href="/@{user.acct}",if="{user_loaded}") {user.name}
                    span.text-muted  @{user.acct}
            p.card-text.question-text {question.answer}
    script.
        apiFetch("/api/web/questions/"+this.opts.q_id).then(r => r.json()).then(r => {
            this.question = r
            apiFetch("/api/web/accounts/id/"+this.question.user).then(r => r.json()).then(r => {
                this.user = r
                this.user_loaded = true
                this.update()
            })
            this.loaded = true
            this.update()
        })