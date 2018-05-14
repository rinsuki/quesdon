import * as React from "react"
import { Question } from "../question"
import { APIQuestion } from "../../../api-interfaces"
import { apiFetch } from "../../api-fetch";
import { Title } from "../common/title";
import { Button } from "reactstrap";
import { Loading } from "../loading";

interface State {
    questions: APIQuestion[]
    loading: boolean
    loadTimer?: number
}

export class PageLatest extends React.Component<{},State> {
    constructor(props: any) {
        super(props)
        this.state = {
            questions: [],
            loading: true
        }
    }
    render() {
        return <div>
            <Title>最近の回答 - Quesdon</Title>
            <h2>最近の回答 <Button color="white" onClick={this.load.bind(this)} disabled={this.state.loading}>再読み込み</Button></h2>
            {this.state.loading ? <Loading/> : this.state.questions.map(question => <Question {...question} />)}
        </div>
    }

    componentDidMount() {
        this.load()
        this.setState({
            loadTimer: window.setInterval(() => {
                this.load()
            }, 5 * 60 * 1000)
        })
    }

    componentWillUnmount() {
        const {loadTimer} = this.state
        if (loadTimer != null) {
            window.clearInterval(loadTimer)
        }
    }

    load() {
        this.setState({loading: true})
        apiFetch("/api/web/questions/latest")
            .then(r => r.json())
            .then(questions => {
                this.setState({questions, loading: false})
            })
    }
}