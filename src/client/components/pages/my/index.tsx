import * as React from "react"
import { Link } from "react-router-dom"
import { APIUser } from "../../../../api-interfaces"
import { apiFetch } from "../../../api-fetch"
import { me } from "../../../initial-state"
import { Title } from "../../common/title"
import { QuestionRemaining } from "../../question-remaining"

export class PageMyIndex extends React.Component {
    render() {
        if (!me) return null
        return <div>
            <Title>マイページ</Title>
            <h1>マイページ</h1>
            <p>こんにちは、{me.name}さん!</p>
            <ul>
                <li><Link to={`/@${me.acct}`}>あなたのプロフィール</Link></li>
                <li><Link to="/my/questions">あなた宛ての質問<QuestionRemaining/></Link></li>
                {!me.isTwitter && <li><Link to="/my/followers">Quesdonを利用しているフォロワー一覧</Link></li>}
                <li><Link to="/my/settings">設定</Link></li>
                <li><a href="javascript://" onClick={this.logoutConfirm.bind(this)}>ログアウト</a></li>
            </ul>
        </div>
    }
    logoutConfirm() {
        if (!confirm("ログアウトしていい?")) return
        apiFetch("/api/web/logout")
            .then((r) => r.json())
            .then((r) => {
                location.pathname = "/"
            })
    }
}
