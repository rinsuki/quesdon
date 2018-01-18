import * as React from "react"
import { NavLink as Link } from "react-router-dom";

interface Props {
    to: string
}

export default class NavLink extends React.Component<Props>{
    render() {
        return <Link className="nav-link" activeClassName="active" to={this.props.to}>{this.props.children}</Link>
    }
}