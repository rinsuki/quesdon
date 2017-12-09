page-my-questions
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h1 質問一覧
        a(href="/my") マイページへ
        my-question(each="{question in questions}",question="{question}") 
    script.
        import "../loading.tag"
        apiFetch("/api/web/questions").then(r => r.json()).then(r => {
            this.questions = r
            this.loaded = true
            this.update()
        })
my-question
    form(action="javascript://",onsubmit="{submit}")
        .card
            .card-body
                h4.card-title {opts.question.question}
                textarea.form-control.mb-4(name="answer", placeholder="回答内容を入力")
                button.btn.btn-primary.card-link(type="submit") 回答
    script.
        this.submit = e => {
            var formData = new FormData(e.target)
            apiFetch("/api/web/questions/"+this.opts.question._id+"/answer", {
                method: "POST",
                body: formData
            }).then(r => r.json()).then(r => {
                alert("答えました")
                location.reload()
            })
        }