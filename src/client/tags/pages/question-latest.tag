page-question-latest
    title 最近の回答 - Quesdon
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h2 最近の回答
        question(each="{question in questions}",question="{question}")
    script.
        import "../question.tag"
        apiFetch("/api/web/questions/latest").then(r => r.json()).then(r => {
            this.questions = r
            this.loaded = true
            this.update()
        })