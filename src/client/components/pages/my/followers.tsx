import * as React from "react"
import { Button } from "reactstrap"
import { APIUser } from "../../../../api-interfaces"
import { apiFetch } from "../../../api-fetch"
import { Title } from "../../common/title"
import { UserLink } from "../../userLink"

interface State {
    maxId: string | undefined
    accounts: APIUser[]
    loading: boolean
}

export class PageMyFollowers extends React.Component<{}, State> {
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
                {this.state.accounts.map((user) => <li><UserLink {...user} /></li>)}
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

    async readMore() {
        function errorMsg(code: number | string) {
            return "読み込みに失敗しました。再度お試しください (" + code + ")"
        }
        this.setState({loading: true})
        const param = this.state.maxId ? "?max_id=" + this.state.maxId : ""
        const req = await apiFetch("/api/web/accounts/followers" + param)
            .catch((e) => {
                alert(errorMsg(-1))
                this.setState({
                    loading: false,
                })
            })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            this.setState({
                loading: false,
            })
            return
        }
        const res = await req.json().catch((e) => {
            alert(errorMsg(-2))
            this.setState({
                loading: false,
            })
        })
        if (!res) return
        this.setState({
            accounts: this.state.accounts.concat(res.accounts),
            maxId: res.max_id,
            loading: false,
        })
    }
}
