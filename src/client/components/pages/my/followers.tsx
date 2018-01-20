import * as React from "react"
import { APIUser } from "../../../../api-interfaces"
import apiFetch from "../../../api-fetch"
import UserLink from "../../userLink"
import { Button } from "reactstrap";
import Title from "../../common/title";

interface State {
    maxId: string | undefined
    accounts: APIUser[]
    loading: boolean
}

export default class PageMyFollowers extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            accounts: [],
            maxId: undefined,
            loading: false,
        }
    }

    render() {
        return <div>
            <Title>Quesdonを利用しているフォロワー一覧 - マイページ</Title>
            <h1>Quesdonを利用しているフォロワー一覧</h1>
            <ul>
                {this.state.accounts.map(user => <li><UserLink {...user} /></li>)}
            </ul>
            <Button disabled={this.state.loading || !this.state.maxId}
                onClick={this.readMore.bind(this)}>
                {this.state.loading ? "読み込み中" : this.state.maxId ? "もっと" : "これで全部です"}
            </Button>
        </div>
    }

    componentDidMount() {
        this.readMore()
    }

    readMore() {
        this.setState({loading: true})
        apiFetch("/api/web/accounts/followers" + (this.state.maxId ? "?max_id="+this.state.maxId : ""))
            .then(r => r.json())
            .then(r => {
                this.setState({
                    accounts: this.state.accounts.concat(r.accounts),
                    maxId: r.max_id,
                    loading: false,
                })
            })
    }
}