page-my-settings
    title 設定 - マイページ - Quesdon
    h1 設定
    a(href="/my") マイページに戻る
    form(action="javascript://", onsubmit="{submit}")
        .form-group
            label ちょっとした説明
            textarea.form-control(name="description",placeholder="しぶやのりんさんがすき",oninput="{description_input}") {window.USER.description}
            small.form-text.text-muted あと{description_count}文字 改行は表示時に反映されません
        .form-group
            label 「質問箱」のところの変更
            .input-group
                span.input-group-addon ◯◯◯さんの
                input.form-control(type="text",placeholder="質問箱",name="questionBoxName",oninput="{questionBoxName_input}",value="{window.USER.questionBoxName || '質問箱'}")
            small.form-text.text-muted あと{questionBoxName_count}文字 改行は表示時に反映されません
        button(type="submit").btn.btn-primary 保存
    h2.mt-3.mb-2 プッシュ通知
    a(href="/api/web/accounts/pushbullet/redirect",if="{!window.USER.pushbulletEnabled}").btn.btn-success Pushbulletと接続して新しい質問が来た際に通知を受け取る
    button(if="{window.USER.pushbulletEnabled}",onclick="{pushbulletDisconnect}").btn.btn-warning Pushbulletとの接続を解除する
    h2.mt-3.mb-2 やばいゾーン
    button(onclick="{all_delete}").btn.btn-danger 自分宛の質問を(回答済みのものも含めて)すべて削除
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
        this.pushbulletDisconnect = e => {
            apiFetch("/api/web/accounts/pushbullet/disconnect", {
                method: "POST"
            }).then(r => r.json()).then(r => {
                alert("切断しました。")
                location.reload()
            })
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
        var r = window.USER
        this.description_input({target: {value: r.description}})
        this.questionBoxName_input({target: {value: r.questionBoxName}})
        this.all_delete = e => {
            const rand = Math.floor(Math.random() * 10)
            if (prompt("あなた(@"+window.USER.acct+")あてに来た質問を「回答済みのものも全て含めて」削除します。\n\n確認のために「"+rand+"」を下に入力してください(数字だけ入力してください)", "") != rand) return
            apiFetch("/api/web/questions/all_delete", {
                method: "POST"
            }).then(r => r.json()).then(r => {
                alert("削除しました。")
                location.reload()
            })
        }