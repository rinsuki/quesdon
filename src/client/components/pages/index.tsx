import * as React from "react"
import { Link } from "react-router-dom"
import { me } from "../../initial-state"
import { PageLatest } from "./latest"

export class PageIndex extends React.Component {
    render() {
        return <div>
            <title>Quesdon</title>
            <h1>Quesdon</h1>
            <p>ザ・インタビューズとかaskfmとかそんなかんじのやつのMastodonアカウントで使えるやつです</p>
            <p>
                <h5>Twitterアカウントでのログインについて</h5>
                <strong>
                    Twitterアカウントでのログインを2018年9月30日で廃止しま<del>す</del>した。
                    廃止後は、これまでTwitterアカウントで答えた回答などが見れなくなります。
                    Mastodonアカウントに質問を移行したい方は管理者までお問い合わせください。
                </strong>
            </p>
            <p>{me ? <Link to="/my">マイページ</Link> : <Link to="/login">ログイン</Link>}</p>
            <PageLatest />
        </div>
    }
}
