import * as React from "react"
import { APIQuestion } from "../../../../api-interfaces";
import apiFetch from "../../../api-fetch"
import Question from "../../question"

interface Props {
    match: {
        params: {[key: string]: string}
    }
}

interface State {
    question: APIQuestion | undefined
}

export default class PageUserQuestion extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            question: undefined
        }
    }

    componentDidMount() {
        apiFetch("/api/web/questions/"+this.props.match.params.question_id)
            .then(r => r.json())
            .then(question => this.setState({question}))
    }

    render() {
        if (!this.state.question) return null
        return <Question {...this.state.question} />
    }
}