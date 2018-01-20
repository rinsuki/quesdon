import * as React from "react"
import { APIUser } from "../../api-interfaces";
import { Link } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav, NavItem, Container } from "reactstrap";
import NavbarBrand from "./common/navbarBrand"
import NavLink from "./common/navLink"

interface Props {
    userInfo: APIUser | undefined
}

interface State {
    isOpen: boolean
}

export default class Header extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }
    render() {
        return <Navbar light expand="md" color="light"><Container>
            <NavbarBrand to="/">Quesdon</NavbarBrand>
            <NavbarToggler onClick={this.toggle.bind(this)} />
            <Collapse navbar isOpen={this.state.isOpen}>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        {this.props.userInfo
                        ? <NavLink to="/my">@{this.props.userInfo.acct}</NavLink>
                        : <NavLink to="/login">ログイン</NavLink>}
                    </NavItem>
                </Nav>
            </Collapse>
        </Container></Navbar>
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen})
    }
}