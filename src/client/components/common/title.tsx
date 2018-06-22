import * as React from "react"

export class Title extends React.Component {
    render() {
        return <title>{this.props.children} - Quesdon</title>
    }
}
