import * as React from "react"
import { Link } from "react-router-dom"

interface Props {
    to: string
}

export class NavbarBrand extends React.Component<Props> {
    render() {
        return <Link className="navbar-brand" to={this.props.to}>
            {this.props.children}
        </Link>
    }
}
