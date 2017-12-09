page-login
    h1 ログイン
    form(action="javascript://",onsubmit="{submit}")
        p あなたのMastodonアカウントがあるインスタンスを入力してください。
        .form-group
            input.form-control(name="instance",placeholder="mastodon.social",autocomplete="on",list="major-instances")
            datalist#major-instances(data-comment="もしあなたのインスタンスをautocompleteに追加したいなら、src/client/tags/pages/login.tagにあなたのインスタンスを追加してPull Requestを送ってください ;)")
                option(each="{instance in majorInstances}",value="{instance}")
        button.btn.btn-primary(type="submit") ログイン
        script.
            this.majorInstances = [
                "mastodon.social",
                "mstdn.jp",
                "friends.nico",
                "pawoo.net",
                "music.pawoo.net",
                "mastodon.cloud",
                "imastodon.net",
                "mstdn.maud.io",
            ]
            this.submit = async e => {
                var formData = new FormData(e.target)
                var res = await fetch("/api/web/oauth/get_url", {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }).then(r => r.json())
                location.href = res.url
            }