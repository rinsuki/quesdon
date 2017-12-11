page-my-questions
    title 質問一覧 - マイページ - Quesdon
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h1 質問一覧
        a(href="/my") マイページへ
        my-question(each="{question in questions}",question="{question}") 
    script.
        import "../loading.tag"
        import "../my-question.tag"
        apiFetch("/api/web/questions").then(r => r.json()).then(r => {
            this.questions = r
            this.loaded = true
            this.update()
        })