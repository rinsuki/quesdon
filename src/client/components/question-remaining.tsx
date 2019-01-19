import * as React from "react"
import { Badge } from "reactstrap"
import { apiFetch } from "../api-fetch"

interface State {
    count: number
    timer?: number | undefined
}

export class QuestionRemaining extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            count: 0,
        }
    }

    render() {
        if (!this.state.count) return null
        return <Badge className="ml-2" pill color="secondary">{this.state.count}</Badge>
    }

    updateCount() {
        apiFetch("/api/web/questions/count")
            .then((r) => r.json())
            .then((r) => this.setState({count: r.count}))
    }

    componentDidMount() {
        this.updateCount()
        this.setState({
            timer: window.setInterval(() => {
                this.updateCount()
            }, 1 * 60 * 1000),
        })
    }

    componentWillUnmount() {
        if (!this.state.timer) return
        clearInterval(this.state.timer)
        this.setState({timer: undefined})
    }
}
