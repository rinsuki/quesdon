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
            <details open>
                <summary>
                    2018/10/01追加: 公式アカウントを
                    <a href="https://mstdn.rinsuki.net/@quesdon">@quesdon@mstdn.rinsuki.net</a>
                    へ移行しました
                </summary>
                以前のアカウントは <a href="https://mstdn.jp/@quesdon">@quesdon@mstdn.jp</a> でしたが、10月1日を持って移行しました。<br />
                お手数ですが、新アカウントもフォローしていただけると嬉しいです。
            </details>
            <details>
                <summary>2018/10/01更新： Twitterアカウントでのサービス提供終了について</summary>
                <strong>
                    Twitterアカウントでのログインを2018年9月30日で廃止しま<del>す</del>した。
                    廃止後は、これまでTwitterアカウントで答えた回答などが見れなくなります。
                    Mastodonアカウントに質問を移行したい方は管理者までお問い合わせください。
                </strong>
            </details>
            <p>{me ? <Link to="/my">マイページ</Link> : <Link to="/login">ログイン</Link>}</p>
            <PageLatest />
        </div>
    }
}
