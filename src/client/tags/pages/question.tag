page-question
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        title Q. {question.question} - {user.name}さんの質問箱 - Quesdon
        question(question="{question}",data-nsfw-guard="0")
    script.
        import "../question.tag"
        apiFetch("/api/web/questions/"+this.opts.q_id).then(r => r.json()).then(r => {
            this.question = r
            this.loaded = true
            this.update()
        })