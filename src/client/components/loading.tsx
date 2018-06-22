import * as React from "react"

export class Loading extends React.Component {
    render() {
        return <div className="mt-2 mb-4">
            <h1 style={{textAlign: "center"}}>Loading...</h1>
            <div className="progress progress-anime">
                <div className="progress-bar"></div>
            </div>
        </div>
    }
}
