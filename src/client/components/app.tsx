import * as React from "react"
import { BrowserRouter, Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { APIUser } from "../../api-interfaces"
import { me } from "../initial-state"
import { Footer } from "./footer"
import { Header } from "./header"
import { PageIndex } from "./pages/index"
import { PageLatest } from "./pages/latest"
import { PageLogin } from "./pages/login"
import { PageMyFollowers } from "./pages/my/followers"
import { PageMyIndex } from "./pages/my/index"
import { PageMyQuestions } from "./pages/my/questions"
import { PageMySettings } from "./pages/my/settings"
import { PageNotFound } from "./pages/notfound"
import { PageUserIndex } from "./pages/user/index"
import { PageUserQuestion } from "./pages/user/question"

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
            <div className="all-container">
                <Header/>
                <main className="container mt-2">
                <Switch>
                    <Route exact path="/" component={PageIndex}/>
                    <Route exact path="/latest" component={PageLatest}/>
                    <Route exact path="/login" component={PageLogin}/>
                    {!me && <Redirect from="/my" to="/login"/>}
                    <Route exact path="/my" component={PageMyIndex}/>
                    <Route exact path="/my/questions" component={PageMyQuestions}/>
                    <Route exact path="/my/followers" component={PageMyFollowers}/>
                    <Route exact path="/my/settings" component={PageMySettings}/>
                    <Route exact path="/@:user_id" render={(props: RouteComponentProps<{user_id: string}>) => {
                        const userId = props.match.params.user_id
                        return <PageUserIndex key={userId} userId={userId}/>
                    }}/>
                    <Route exact path="/@:user_id/questions/:question_id" component={PageUserQuestion}/>
                    <Route component={PageNotFound}/>
                </Switch>
                </main>
                <Footer />
            </div>
            </BrowserRouter>
        )
    }
}
