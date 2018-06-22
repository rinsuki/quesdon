import * as React from "react"
import { Link } from "react-router-dom"
import { Collapse, Container, Nav, Navbar, NavbarToggler, NavItem } from "reactstrap"
import { APIUser } from "../../api-interfaces"
import { me } from "../initial-state"
import { NavbarBrand } from "./common/navbarBrand"
import { NavLink } from "./common/navLink"
import { QuestionRemaining } from "./question-remaining"

interface State {
    isOpen: boolean
}

export class Header extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            isOpen: false,
        }
    }
    render() {
        return <Navbar light expand="md" color="light"><Container>
            <NavbarBrand to="/">Quesdon</NavbarBrand>
            <NavbarToggler onClick={this.toggle.bind(this)} />
            <Collapse navbar isOpen={this.state.isOpen}>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        {me
                        ? <NavLink to="/my">@{me.acctDisplay}<QuestionRemaining/></NavLink>
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
