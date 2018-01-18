import * as React from "react"
import "xdate"
const XDate = require("xdate")
import { Card, CardBody, CardTitle, CardText, Input, Button, FormGroup, CardSubtitle } from "reactstrap";
import { APIQuestion } from "../../api-interfaces"
import { Link } from "react-router-dom";
import UserLink from "./userLink"
import Checkbox from "./common/checkbox"

interface Props extends APIQuestion {
    hideQuestionUser?: boolean | undefined
}

interface State {
    isNotEmpty: boolean
}

export default class Question extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            isNotEmpty: false
        }
    }
    render() {
        return <Card className="mb-3">
            <CardBody>
                <CardTitle>{this.props.question}</CardTitle>
                <CardSubtitle className="mb-2">
                    {this.renderAnswerUser()}
                    {this.renderQuestionUser()}
                    {this.props.answeredAt && <Link to={`/@${this.props.user.acct}/questions/${this.props._id}`} className="text-muted">{new XDate(this.props.answeredAt).toLocaleString()}</Link>}
                </CardSubtitle>
                {this.props.answeredAt ? this.renderAnswer() : this.renderAnswerForm()}
            </CardBody>
        </Card>
    }

    renderAnswerUser() {
        if (this.props.hideQuestionUser) return null
        return <span className="mr-2">
            回答者:&nbsp;
            <UserLink {...this.props.user}/>
        </span>
    }

    renderQuestionUser() {
        if (!this.props.questionUser) return null
        return <span className="mr-2">
            質問者:&nbsp;
            <UserLink {...this.props.questionUser}/>
        </span>
    }

    renderAnswer() {
        return <CardText>{this.props.answer}</CardText>
    }

    renderAnswerForm() {
        return <form>
            <FormGroup>
                <Input type="textarea" name="answer" placeholder="回答内容を入力" onInput={this.onInput.bind(this)}/>
            </FormGroup>
            <Button type="submit" color="primary" disabled={!this.state.isNotEmpty}>回答</Button>
            <span className="ml-3">公開範囲: </span>
            <Input type="select" name="visibility" style={{width: "inherit", display: "inline-block"}}>
                <option value="public">公開</option>
                <option value="unlisted">未収録</option>
                <option value="private">非公開</option>
                <option value="no">投稿しない</option>
            </Input>
            <Checkbox name="isNSFW" value="true" className="ml-2">NSFW</Checkbox>
            <Button type="button" color="danger" style={{float: "right"}}>削除</Button>
        </form>
    }

    onInput(e: any) {
        this.setState({isNotEmpty: e.target.value != ""}) 
    }
}