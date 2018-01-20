import * as React from "react"
import Question from "../question"
import { APIQuestion } from "../../../api-interfaces"
import apiFetch from "../../api-fetch";
import Title from "../common/title";

interface State {
    questions: APIQuestion[]
}

export default class PageLatest extends React.Component<{},State> {
    constructor(props: any) {
        super(props)
        this.state = {
            questions: []
        }
    }
    render() {
        return <div>
            <Title>最近の回答 - Quesdon</Title>
            <h2>最近の回答</h2>
            {this.state.questions.map(question => <Question {...question} />)}
        </div>
    }

    componentDidMount() {
        apiFetch("/api/web/questions/latest")
            .then(r => r.json())
            .then(questions => {
                this.setState({questions})
            })
    }
}