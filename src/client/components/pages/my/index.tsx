import * as React from "react"
import { Link } from "react-router-dom";
import apiFetch from "../../../api-fetch"
import { APIUser } from "../../../../api-interfaces"
import { me } from "../../../initial-state"
import Title from "../../common/title";

export default class PageMyIndex extends React.Component {
    render() {
        if (!me) return null
        return <div>
            <Title>マイページ</Title>
            <h1>マイページ</h1>
            <p>こんにちは、{me.name}さん!</p>
            <ul>
                <li><Link to={`/@${me.acct}`}>あなたのプロフィール</Link></li>
                <li><Link to="/my/questions">あなた宛ての質問</Link></li>
                <li><Link to="/my/followers">Quesdonを利用しているフォロワー一覧</Link></li>
                <li><Link to="/my/settings">設定</Link></li>
                <li><a href="javascript://" onClick={this.logoutConfirm.bind(this)}>ログアウト</a></li>
            </ul>
        </div>
    }
    async logoutConfirm() {
        if (!confirm("ログアウトしていい?")) return
        await (await apiFetch("/api/web/logout")).json()
        location.pathname="/"
    }
}