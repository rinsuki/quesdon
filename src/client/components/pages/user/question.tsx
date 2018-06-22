import * as React from "react"
import { APIQuestion } from "../../../../api-interfaces"
import { apiFetch } from "../../../api-fetch"
import { Title } from "../../common/title"
import { Loading } from "../../loading"
import { Question } from "../../question"

interface Props {
    match: {
        params: {[key: string]: string},
    }
}

interface State {
    question: APIQuestion | undefined
}

export class PageUserQuestion extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            question: undefined,
        }
    }

    componentDidMount() {
        apiFetch("/api/web/questions/" + this.props.match.params.question_id)
            .then((r) => r.json())
            .then((question) => this.setState({question}))
    }

    render() {
        if (!this.state.question) return <Loading/>
        return <div>
            <Title>{this.state.question.user.name} さん宛ての質問: 「{this.state.question.question}」</Title>
            <Question {...this.state.question} noNsfwGuard/>
        </div>
    }
}
