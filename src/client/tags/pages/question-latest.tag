page-question-latest
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h2 最近の回答
        .card.mb-2(each="{question in questions}")
            .card-body
                h4.card-title {question.question}
                h6.card-subtitle.mb-2
                    | 回答者: 
                    a(href="/@{question.user.acct}") {question.user.name}
                        span.text-muted  @{question.user.acct}
                p.card-text.question-text {question.answer}
    script.
        apiFetch("/api/web/questions/latest").then(r => r.json()).then(r => {
            this.questions = r
            this.loaded = true
            this.update()
        })