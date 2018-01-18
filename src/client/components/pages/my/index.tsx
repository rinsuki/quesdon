import * as React from "react"
import { Link } from "react-router-dom";
import apiFetch from "../../../api-fetch"
import APIUser from "../../../../api-interface/APIUser"

interface Props {
    userInfo: APIUser
}

export default class PageMyIndex extends React.Component<Props> {
    render() {
        return <div>
            <h1>マイページ</h1>
            <p>こんにちは、{this.props.userInfo.name}さん!</p>
            <ul>
                <li><Link to={`/@${this.props.userInfo.acct}`}>あなたのプロフィール</Link></li>
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