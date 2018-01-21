import * as React from "react"
import { me } from "../../initial-state"
import { Link } from "react-router-dom";
import PageLatest from "./latest"

export default class PageIndex extends React.Component {
    render() {
        return <div>
            <title>Quesdon</title>
            <h1>Quesdon</h1>
            <p>ザ・インタビューズとかaskfmとかそんなかんじのやつのMastodonアカウントで使えるやつです</p>
            <p><strong>2018年1月21日よりTwitterアカウントでも使えるようになりました。ログイン画面で「Twitterでログイン」をクリックするとTwitterアカウントで利用できます。</strong></p>
            <p>{me ? <Link to="/my">マイページ</Link> : <Link to="/login">ログイン</Link>}</p>
            <PageLatest />
        </div>
    }
}