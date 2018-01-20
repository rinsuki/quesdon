import * as React from "react"
import { Link } from "react-router-dom";
import Title from "../common/title";

export default class PageBetaHelp extends React.Component {
    render() {
        return <div>
            <Title>β版について</Title>
            <h1>β版について</h1>
            <ul>
                <li>通常版とデータは同期されています</li>
                <li>一部未実装な部分や不具合があります</li>
                <li>不具合に気付いたら <Link to="/@quesdon@mstdn.jp">公式アカウントの質問箱</Link> もしくは Mastodonで <code>@quesdon@mstdn.jp</code> に
                    <ul>
                        <li>ご利用の環境(使っているブラウザ,ブラウザやOSのバージョン、スマホ等の場合は端末名)</li>
                        <li>不具合が発生したURL</li>
                        <li>不具合の内容</li>
                        <li>再現性があるかどうか、再現性がある場合は再現方法</li>
                    </ul>
                    を添えてご連絡ください。<br />
                    回答はお約束できませんが、気づきしたい確認し可能である場合修正します。
                </li>
                <li>通常版に比べて機能等が退化している箇所等に気付かれた場合は、<Link to="/@quesdon@mstdn.jp">公式アカウントの質問箱</Link> までおよせください。</li>
            </ul>
        </div>
    }
}