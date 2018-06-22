import * as React from "react"
import { Link } from "react-router-dom"
import { Title } from "../common/title"

export class PageNotFound extends React.Component {
    render() {
        return <div>
            <Title>Not Found</Title>
            <h1>Not Found</h1>
            <p>指定されたページが見つかりませんでした。</p>
            <p><Link to="/">トップに戻る</Link></p>
        </div>
    }
}
