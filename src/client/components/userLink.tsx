import * as React from "react"
import { Link } from "react-router-dom"
import { APIUser } from "../../api-interfaces"

// tslint:disable-next-line:no-empty-interface
interface Props extends APIUser {
}

export class UserLink extends React.Component<Props> {
    render() {
        return <Link to={`/@${this.props.acct}`}>
            {this.props.name}
            <span className="text-muted">&nbsp;@{this.props.acctDisplay}</span>
        </Link>
    }
}
