import * as React from "react"
import { Input, Button, FormGroup } from "reactstrap";
import majorInstances from "../../major-instances"
import apiFetch from "../../api-fetch"
import Title from "../common/title";

export default class PageLogin extends React.Component {
    render() {
        return <div>
            <Title>ログイン</Title>
            <h1>ログイン</h1>
            <p>あなたのMastodonアカウントがあるインスタンスを入力してください。</p>
            <form action="javascript://" onSubmit={this.send.bind(this)}>
                <FormGroup>
                    <Input name="instance" placeholder="mastodon.social" list="major-instances"/>
                    <datalist id="major-instances">
                        {majorInstances.map(instance => <option value={instance} />)}
                    </datalist>
                </FormGroup>
                <Button type="submit" color="primary">ログイン</Button>
            </form>
        </div>
    }

    async send(e: any) {
        const form = new FormData(e.target)
        var res = await apiFetch("/api/web/oauth/get_url", {
            method: "POST",
            body: form,
        }).then(r =>r.json())
        location.href = res.url
    }
}