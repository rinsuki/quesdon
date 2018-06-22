import * as React from "react"
import { Button } from "reactstrap"
import { APIQuestion } from "../../../api-interfaces"
import { apiFetch } from "../../api-fetch"
import { Title } from "../common/title"
import { Loading } from "../loading"
import { Question } from "../question"

interface State {
    questions: APIQuestion[]
    loading: boolean
    loadFailed?: number
    loadTimer?: number
}

export class PageLatest extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            questions: [],
            loading: true,
        }
    }
    render() {
        const {
            loading,
            loadFailed,
            questions,
        } = this.state
        return <div>
            <Title>最近の回答 - Quesdon</Title>
            <h2>最近の回答 <Button color="white" onClick={this.load.bind(this)} disabled={loading}>再読み込み</Button></h2>
            { loading
                ? <Loading/>
                : loadFailed
                    ? <span>
                        読み込みに失敗しました。上の再読み込みボタンを押して再度お試しください。
                        ({loadFailed < 0 ? loadFailed : "HTTP-" + loadFailed})
                    </span>
                    : questions.map((question) => <Question {...question} key={question._id}/>)
            }
        </div>
    }

    componentDidMount() {
        this.load()
        this.setState({
            loadTimer: window.setInterval(() => {
                this.load()
            }, 5 * 60 * 1000),
        })
    }

    componentWillUnmount() {
        const {loadTimer} = this.state
        if (loadTimer != null) {
            window.clearInterval(loadTimer)
        }
    }

    async load() {
        this.setState({loading: true})
        const req = await apiFetch("/api/web/questions/latest").catch((err) => {
            this.setState({
                loading: false,
                loadFailed: -1,
            })
        })
        if (!req) return
        if (!req.ok) {
            this.setState({
                loading: false,
                loadFailed: req.status,
            })
        }

        const questions = await req.json().catch((err) => {
            this.setState({
                loading: false,
                loadFailed: -2,
            })
        })
        if (!questions) return
        this.setState({
            loading: false,
            loadFailed: undefined,
            questions,
        })
    }
}
