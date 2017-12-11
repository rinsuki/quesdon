my-question
    form(action="javascript://",onsubmit="{submit}").mt-3
        .card
            .card-body
                h4.card-title {opts.question.question}
                textarea.form-control.mb-4(name="answer", placeholder="回答内容を入力")
                button.btn.btn-primary.card-link(type="submit") 回答
                span.card-link 公開範囲: 
                    select.form-control.card-link(style="display:inline-block;width:inherit;",name="visibility")
                        option(value="public") 公開
                        option(value="unlisted") 未収載
                        option(value="private") 非公開
                        option(value="no") 投稿しない
                button.btn.btn-danger(type="button",style="float:right;",onclick="{delete}") 削除
    script.
        this.submit = e => {
            var formData = new FormData(e.target)
            apiFetch("/api/web/"+(this.opts.is_bottle ? "bottles" : "questions")+"/"+this.opts.question._id+"/answer", {
                method: "POST",
                body: formData
            }).then(r => r.json()).then(r => {
                alert("答えました")
                location.reload()
            })
        }
        this.delete = e => {
            if(!confirm("質問を削除します。\n削除した質問は二度と元に戻せません。\n本当に質問を削除しますか?")) return
            apiFetch("/api/web/questions/"+this.opts.question._id+"/delete", {
                method: "POST"
            }).then(r => r.json()).then(r => {
                alert("削除しました")
                location.reload()
            })
        }