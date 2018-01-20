import * as React from "react"
import { Link } from "react-router-dom";
import { APIQuestion, APIUser } from "../../../../api-interfaces"
import Question from "../../question";
import apiFetch from "../../../api-fetch"
import { Button } from "reactstrap";
import Title from "../../common/title";

interface State {
    questions: APIQuestion[]
}
export default class PageMyQuestions extends React.Component<{},State> {
    constructor(props: {}) {
        super(props)
        this.state = {questions: []}
    }
    render() {
        return <div>
            <Title>質問一覧 - マイページ</Title>
            <h1>質問一覧</h1>
            <Link to="/my">マイページへ</Link>
            <div className="mt-3">
                {this.state.questions.map(q => <Question {...q} hideAnswerUser key={q._id}/>)}
            </div>
            <Button href={this.getShareUrl()} color="secondary" target="_blank">自分の質問箱のページを共有<wbr />(新しいページで開きます)</Button>
        </div>
    }

    componentDidMount() {
        apiFetch("/api/web/questions").then(r => r.json()).then(questions => {
            this.setState({questions})
        })
    }
    getShareUrl() {
        const user = (window as any).USER as APIUser
        const text = `私の${user.questionBoxName || "質問箱"}です #quesdon ${location.origin}/@${user.acct}`
        return `https://${user.hostName}/share?text=${encodeURIComponent(text)}`
    }
}