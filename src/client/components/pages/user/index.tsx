import * as React from "react"
import { Jumbotron, Input, Button, Badge } from "reactstrap";
import { APIUser, APIQuestion } from "../../../../api-interfaces";
import Checkbox from "../../common/checkbox"
import Question from "../../question"
import apiFetch from "../../../api-fetch";
import { me } from "../../../initial-state"

interface Props {
    match: {
        params: {[key: string]: string}
    }
}

interface State {
    user: APIUser | undefined
    questions: APIQuestion[] | undefined
    questionLength: number
    questionMax: number
}

export default class PageUserIndex extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            user: undefined,
            questions: undefined,
            questionLength: 0,
            questionMax: 200
        }
    }

    render() {
        const { user } = this.state
        if (!user) return null
        return <div>
            <Jumbotron><div style={{textAlign: "center"}}>
                <img src={user.avatarUrl}/>
                <h1>{user.name}</h1>
                <p>
                    さんの{user.questionBoxName || "質問箱"}&nbsp;
                    <a href={user.url || `https://${user.hostName}/@${user.acct.split("@")[0]}`}
                        rel="nofollow">
                        Mastodonのプロフィール
                    </a>
                </p>
                <p>{user.description}</p>
                <form action="javascript://" onSubmit={this.questionSubmit.bind(this)}>
                    <Input type="textarea" name="question"
                        placeholder="質問する内容を入力"
                        onInput={this.questionInput.bind(this)}
                    />
                    <div className="d-flex mt-1">
                        {me && !user.allAnon && <div className="p-1">
                            <Checkbox name="noAnon" value="true">名乗る</Checkbox>
                        </div>}
                        <div className="ml-auto">
                            <span className={"mr-3 "+
                                (this.state.questionLength > this.state.questionMax ? "text-danger" : "")
                            }>
                                {this.state.questionMax - this.state.questionLength}
                            </span>
                            <Button color="primary" className="col-xs-2"
                                disabled={!this.state.questionLength || this.state.questionLength > this.state.questionMax}>
                                質問する
                            </Button>
                        </div>
                    </div>
                </form>
            </div></Jumbotron>
            {this.state.questions && 
                <div>
                    <h2>回答&nbsp;<Badge pill>{this.state.questions.length}</Badge></h2>
                    {this.state.questions.map(question => <Question {...question} hideAnswerUser key={question._id}/>)}
                </div>
            }
        </div>
    }

    componentDidMount() {
        apiFetch("/api/web/accounts/"+this.props.match.params.user_id)
            .then(r => r.json())
            .then(user => this.setState({user}))
        apiFetch("/api/web/accounts/"+this.props.match.params.user_id+"/questions")
            .then(r => r.json())
            .then(questions => this.setState({questions}))
    }
    
    questionSubmit(e: any) {
        if (!this.state.user) return
        const form = new FormData(e.target)
        apiFetch("/api/web/accounts/"+this.state.user.acct+"/question", {
            method: "POST",
            body: form
        }).then(r => r.json()).then(r => {
            alert("質問しました!")
            location.reload()
        })
    }

    questionInput(e: any) {
        const count = e.target.value.length
        this.setState({
            questionLength: count
        })
    }
}