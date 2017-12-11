page-bottles-top
    h1 メッセージボトル
    button.btn.btn-primary(onclick="{refresh}") 他の
    a.btn.btn-secondary.ml-3(href="/bottles/new") メッセージボトルを作成する
    my-question(question="{bottle}",if="{bottle}",is_bottle="1")
    loading(if="{!bottle}")
    script.
        import "../loading.tag"
        this.refresh = () => {
            apiFetch("/api/web/bottles/gacha?other="+(this.bottle || {})._id).then(r => r.json()).then(r => {
                this.bottle = r
                this.update()
            })
            this.bottle = undefined
            this.update()
        }
        this.refresh()
    style.
        my-question .btn-danger {
            display: none;
        }