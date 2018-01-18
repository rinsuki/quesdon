import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom";
import APIUser from "../../api-interface/APIUser";
import Header from "./header";
import PageIndex from "./pages/index";
import PageLogin from "./pages/login";
import PageMyIndex from "./pages/my/index";
import PageMyQuestions from "./pages/my/questions";

interface Props {
    userInfo: APIUser | undefined
}

export default class App extends React.Component<Props> {
    render() {
        return (
            <BrowserRouter>
            <div>
                <Header userInfo={this.props.userInfo} />
                <div className="container mt-2">
                <Switch>
                    <Route exact path="/" component={PageIndex}/>
                    <Route exact path="/login" component={PageLogin}/>
                    <Route exact path="/my">
                        <PageMyIndex userInfo={this.props.userInfo!}/>
                    </Route>
                    <Route exact path="/my/questions" component={PageMyQuestions}/>
                </Switch>
                </div>
            </div>
            </BrowserRouter>
        )
    }
}