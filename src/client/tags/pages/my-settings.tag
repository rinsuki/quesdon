page-my-settings
    title 設定 - マイページ - Quesdon
    loading(if="{!loaded}")
    virtual(if="{loaded}")
        h1 設定
        a(href="/my") マイページに戻る
        form(action="javascript://", onsubmit="{submit}")
            .form-group
                label ちょっとした説明
                textarea.form-control(name="description",placeholder="しぶやのりんさんがすき",oninput="{description_input}") {user.description}
                small.form-text.text-muted あと{description_count}文字 改行は表示時に反映されません
            .form-group
                label 「質問箱」のところの変更
                .input-group
                    span.input-group-addon ◯◯◯さんの
                    input.form-control(type="text",placeholder="質問箱",name="questionBoxName",oninput="{questionBoxName_input}",value="{user.questionBoxName || '質問箱'}")
                small.form-text.text-muted あと{questionBoxName_count}文字 改行は表示時に反映されません
            button(type="submit").btn.btn-primary 保存
    script.
        import "../loading.tag"
        this.description_max = 200
        this.description_count = this.description_max
        this.description_input = e => {
            this.description_count = this.description_max - e.target.value.length
        }
        this.questionBoxName_max = 10
        this.questionBoxName_count = this.questionBoxName_max
        this.questionBoxName_input = e => {
            this.questionBoxName_count = this.questionBoxName_max - e.target.value.length
        }
        this.submit = e => {
            var formData = new FormData(e.target)
            apiFetch("/api/web/accounts/update", {
                method: "POST",
                body: formData
            }).then(r => r.json()).then(r => {
                alert("更新しました!")
                location.reload()
            })
        }
        apiFetch("/api/web/accounts/verify_credentials").then(r => r.json()).then(r => {
            this.user = r
            this.description_input({target: {value: r.description}})
            this.questionBoxName_input({target: {value: r.questionBoxName}})
            this.loaded = true
            this.update()
        })