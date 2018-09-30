import * as React from "react"
import { Alert, Button, FormGroup, Input } from "reactstrap"
import { apiFetch } from "../../api-fetch"
import majorInstances from "../../major-instances"
import { Title } from "../common/title"

interface State {
    loading: boolean
}

export class PageLogin extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    render() {
        const { loading } = this.state
        return <div>
            <Title>ログイン</Title>
            <h1>ログイン</h1>
            <p>あなたのMastodonアカウントがあるインスタンスを入力してください。</p>
            <form action="javascript://" onSubmit={this.send.bind(this)}>
                <FormGroup>
                    <Input name="instance" placeholder="mastodon.social" list="major-instances"/>
                    <datalist id="major-instances">
                        {majorInstances.map((instance) => <option value={instance} />)}
                    </datalist>
                </FormGroup>
                <Button type="submit" color="primary" disabled={loading}>{ loading ? "読み込み中" : "ログイン" }</Button>
                {/* <span>&nbsp;もしくは&nbsp;</span>
                <Button type="button" color="secondary" disabled={loading} onClick={this.twitterLogin.bind(this)}>
                    { loading ? "読み込み中" : "Twitterでログイン" }
                </Button> */}
            </form>
            <Alert color="danger" className="mt-3">
                <h5>Twitterアカウントでのサービス提供終了について</h5>
                <p>
                    Twitterの開発者向けポリシー改定の影響で、QuesdonでのTwitterアカウントを利用したサービス提供を
                    <strong>2018年9月30日</strong>
                    に停止しま
                    <del>す</del>
                    した。
                </p>
                <p>これ以降は、TwitterアカウントでQuesdonにログインできなくなり、またTwitterアカウントで開設した質問箱で回答した質問等も閲覧できなくなります。</p>
                <p>Mastodonアカウントへの質問データの移行は、該当するTwitterアカウントからTwitter
                    <a href="https://twitter.com/quesdon">@quesdon</a>
                    までダイレクトメッセージでお問い合わせください。
                </p>
                <p>ご利用ありがとうございました。</p>
                <strong>なお、Mastodonアカウントでログインされているユーザーの皆様には影響はありません。</strong>これまで通りサービスをご利用いただけます。
            </Alert>
        </div>
    }

    send(e: any) {
        const form = new FormData(e.target)
        this.callApi(form)
    }
    async callApi(form: FormData) {
        this.setState({
            loading: true,
        })
        function errorMsg(code: number | string) {
            return "ログインに失敗しました。入力内容をご確認の上、再度お試しください (" + code + ")"
        }
        const req = await apiFetch("/api/web/oauth/get_url", {
            method: "POST",
            body: form,
        }).catch((e) => {
            alert(errorMsg(-1))
            this.setState({
                loading: false,
            })
        })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            this.setState({
                loading: false,
            })
            return
        }
        const urlRes = await req.json().catch((e) => {
            alert(errorMsg(-2))
            this.setState({
                loading: false,
            })
        })
        if (!urlRes) return
        location.href = urlRes.url
    }

    twitterLogin() {
        const form = new FormData()
        form.append("instance", "twitter.com")
        this.callApi(form)
    }
}
