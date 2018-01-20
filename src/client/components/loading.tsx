import * as React from "react"

export default class Loading extends React.Component {
    render() {
        return <div>
            <h1 style={{textAlign: "center"}}>Loading...</h1>
            <div className="progress progress-anime">
                <div className="progress-bar"></div>
            </div>
        </div>
    }
}