page-user-top
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        title {user.name}さんの質問箱 - Quesdon
        .jumbotron(style="text-align: center")
            img(src="{user.avatarUrl}",style="width:8em;height:8em;")
            h1 {user.name}
            p さんの{user.questionBoxName || "質問箱"}
                a(href='{user.avatar || "https://"+user.acct.split("@")[1]+"/@"+user.acct.split("@")[0]}',rel="nofollow") Mastodonのプロフィール
            p {user.description}
            form(action="javascript://",onsubmit="{submit}")
                textarea.form-control(name="question", placeholder="質問する内容を入力",oninput="{input_question}")
                .d-flex.mt-1
                    .p-1(if="{window.USER && !user.allAnon}")
                        label.custom-control.custom-checkbox
                            input.custom-control-input(type="checkbox", name="noAnon", value="1")
                            span.custom-control-indicator(style="border:1px solid rgba(0,0,255,0.2)")
                            span.custom-control-description 名乗る
                    .ml-auto
                        span(ref="character_counter",style="padding-right: 1em;") {charcounter}
                        button.btn.btn-primary.col-xs-2(type="submit",disabled="{charcounter < 0 || charcounter === charmax}") 質問する
        h2 回答
            span.badge.badge-pill.badge-secondary(if="{questions.length}",style="font-size: 50%") {questions.length}
        question(each="{question in questions}",if="{question_loaded}",question="{question}",data-hide-answer-user="1")
        loading(if="{!question_loaded}")
    script.
        import "../loading.tag"
        import "../question.tag"
        console.log(this.opts)
        this.questions = []
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
