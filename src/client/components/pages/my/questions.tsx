import * as React from "react"
import { Link } from "react-router-dom";
import { APIQuestion } from "../../../../api-interfaces"
import Question from "../../question";
import apiFetch from "../../../api-fetch"

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
            <h1>質問一覧</h1>
            <Link to="/my">マイページへ</Link>
            {this.state.questions.map(q => <Question {...q} hideQuestionUser key={q._id}/>)}
        </div>
    }

    componentDidMount() {
        apiFetch("/api/web/questions").then(r => r.json()).then(questions => {
            this.setState({questions})
        })
    }
}