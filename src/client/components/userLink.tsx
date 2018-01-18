import * as React from "react"
import { Link } from "react-router-dom";
import { APIUser } from "../../api-interfaces";

interface Props extends APIUser {
}

export default class UserLink extends React.Component<Props> {
    render() {
        return <Link to={`/@${this.props.acct}`}>
            {this.props.name}
            <span className="text-muted">&nbsp;@{this.props.acct}</span>
        </Link>
    }
}