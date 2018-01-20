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
            <p>{me ? <Link to="/my">マイページ</Link> : <Link to="/login">ログイン</Link>}</p>
            <PageLatest />
        </div>
    }
}