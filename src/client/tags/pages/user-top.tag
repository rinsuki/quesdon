page-user-top
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        title {user.name}さんの質問箱 - Quesdon
        .jumbotron(style="text-align: center")
            img(src="{user.avatarUrl}",style="width:8em;height:8em;")
            h1 {user.name}
            p さんの質問箱 
                a(href='{user.avatar || "https://"+user.acct.split("@")[1]+"/@"+user.acct.split("@")[0]}',rel="nofollow") Mastodonのプロフィール
            form(action="javascript://",onsubmit="{submit}")
                textarea.form-control(name="question", placeholder="質問する内容を入力",oninput="{input_question}")
                .d-flex.justify-content-end(style="line-height: 2.5em;")
                    span(ref="character_counter",style="padding-right: 1em;") {charcounter}
                    button.btn.btn-primary.col-xs-2(type="submit",disabled="{charcounter < 0}") 質問する
        h2 回答
        .card.mb-2(each="{question in questions}",if="{question_loaded}")
            .card-body
                h4.card-title {question.question}
                h6.card-subtitle.mb-2: a(href="/@{user.acct}/questions/{question._id}").text-muted {question.answeredAt}
                p.card-text.question-text {question.answer}
        loading(if="{!question_loaded}")
    script.
        import "../loading.tag"
        console.log(this.opts)
        this.charmax = 200
        this.charcounter = this.charmax
        this.input_question = (e) => {
            this.charcounter = this.charmax - e.target.value.length
        }
        apiFetch("/api/web/accounts/"+this.opts.acct).then(r => r.json()).then(r => {
            this.user = r
            this.loaded = true
            this.update()
            return apiFetch("/api/web/accounts/"+this.opts.acct+"/questions")
        }).then(r => r.json()).then(r => {
            this.questions = r
            this.question_loaded = true
            this.update()
        })
        this.submit = e => {
            var formData = new FormData(e.target)
            apiFetch("/api/web/accounts/"+this.opts.acct+"/question", {
                method: "POST",
                body: formData
            }).then(r => r.json()).then(r => {
                alert("質問しました!")
                location.reload()
            })
        }