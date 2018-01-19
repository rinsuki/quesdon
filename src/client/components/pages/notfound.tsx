import * as React from "react"
import { Link } from "react-router-dom";

export default class PageNotFound extends React.Component {
    render() {
        return <div>
            <h1>Not Found</h1>
            <p>指定されたページが見つかりませんでした。</p>
            <p>未実装な機能の場合、<a href={"https://quesdon.rinsuki.net"+location.pathname}>通常版</a>を使うと動作する可能性があります。</p>
            <p><Link to="/">トップに戻る</Link></p>
        </div>
    }
}