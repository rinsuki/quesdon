import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "reactstrap"
import { APIQuestion, APIUser } from "../../../../api-interfaces"
import { apiFetch } from "../../../api-fetch"
import { Title } from "../../common/title"
import { Loading } from "../../loading"
import { Question } from "../../question"

interface State {
    questions: APIQuestion[]
    loading: boolean
    loadFailed?: number
}
export class PageMyQuestions extends React.Component<{}, State> {
    constructor(props: {}) {
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
            <Title>質問一覧 - マイページ</Title>
            <h1>質問一覧</h1>
            <Link to="/my">マイページへ</Link>
            <div className="mt-3">
                {loading
                    ? <Loading/>
                    : loadFailed
                        ?   <span>
                            読み込みに失敗しました({ loadFailed < 0 ? loadFailed : "HTTP-" + loadFailed })。
                            <a href="javascript://" onClick={this.load.bind(this)}>再度読み込む</a>
                            </span>
                        : questions.map((q) => <Question {...q} hideAnswerUser key={q._id}/>)
                }
            </div>
            <Button href={this.getShareUrl()} color="secondary" target="_blank">
                自分の質問箱のページを共有
                <wbr />
                (新しいページで開きます)
            </Button>
        </div>
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        this.setState({
            loading: true,
            loadFailed: undefined,
        })
        const req = await apiFetch("/api/web/questions").catch((e) => {
            this.setState({
                loading: false,
                loadFailed: -1,
            })
            return
        })
        if (!req) return
        if (!req.ok) {
            this.setState({
                loading: false,
                loadFailed: req.status,
            })
            return
        }

        const questions = await req.json().catch((e) => {
            this.setState({
                loading: false,
                loadFailed: -2,
            })
            return
        })
        if (!questions) return
        this.setState({questions, loading: false})
    }
    getShareUrl() {
        const user = (window as any).USER as APIUser
        const text = `私の${user.questionBoxName || "質問箱"}です #quesdon ${location.origin}/@${user.acct}`
        return `https://${user.hostName}/${user.isTwitter ? "intent/tweet" : "share"}?text=${encodeURIComponent(text)}`
    }
}
