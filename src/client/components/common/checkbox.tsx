import * as React from "react"

interface Props {
    id?: string
    name: string
    checked?: boolean | undefined
    value: string
    onChange?: (e: any) => void | undefined
    className?: string| undefined
}

interface State {
    id: string
}

export class Checkbox extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            id: "checkbox_temp_" + (Math.random().toString().replace("0.", "")),
        }
    }

    render() {
        const domId = this.props.id || this.state.id
        return <span className={`custom-control custom-checkbox ${this.props.className}`} style={{
            display: "inline",
        }}>
            <input className="custom-control-input"
                type="checkbox"
                name={this.props.name}
                defaultChecked={this.props.checked}
                value={this.props.value}
                onChange={this.props.onChange}
                id={domId}
            />
            <label className="custom-control-label" htmlFor={domId}>{this.props.children}</label>
        </span>
    }
}
