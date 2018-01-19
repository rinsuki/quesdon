import * as React from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { APIUser } from "../../api-interfaces";
import Header from "./header";
import PageIndex from "./pages/index";
import PageLogin from "./pages/login";
import PageMyIndex from "./pages/my/index";
import PageMyQuestions from "./pages/my/questions";
import PageUserIndex from "./pages/user/index"
import PageUserQuestion from "./pages/user/question";
import PageLatest from "./pages/latest";
import { me }  from "../initial-state"
import PageMyFollowers from "./pages/my/followers";

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
                    <Route exact path="/latest" component={PageLatest}/>
                    <Route exact path="/login" component={PageLogin}/>
                    {!me && <Redirect from="/my" to="/login"/>}
                    <Route exact path="/my" component={PageMyIndex}/>
                    <Route exact path="/my/questions" component={PageMyQuestions}/>
                    <Route exact path="/my/followers" component={PageMyFollowers}/>
                    <Route exact path="/@:user_id" component={PageUserIndex}/>
                    <Route exact path="/@:user_id/questions/:question_id" component={PageUserQuestion}/>
                </Switch>
                </div>
            </div>
            </BrowserRouter>
        )
    }
}