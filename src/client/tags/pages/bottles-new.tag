page-bottles-new
    h1 ボトルを作成
    form(action="javascript://", onsubmit="{submit}")
        textarea.form-control(name="question", placeholder="ボトルの内容を入力",oninput="{input_question}")
        .d-flex.justify-content-end(style="line-height: 2.5em;")
            span(ref="character_counter",style="padding-right: 1em;") {charcounter}
            button.btn.btn-primary.col-xs-2(type="submit",disabled="{charcounter < 0}") 質問する
    script.
        import "../loading.tag"
        this.questions = []
        this.charmax = 200
        this.charcounter = this.charmax
        this.input_question = (e) => {
            this.charcounter = this.charmax - e.target.value.length
        }
        this.submit = e => {
            var formData = new FormData(e.target)
            apiFetch("/api/web/bottles/new", {
                method: "POST",
                body: formData
            }).then(r => r.json()).then(r => {
                alert("ボトルを海に流しました!")
                location.reload()
            })
        }