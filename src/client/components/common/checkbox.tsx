import * as React from "react"

interface Props {
    name: string
    checked?: boolean | undefined
    value: string
    onChange?: (e: any) => void | undefined
    className?: string| undefined
}

export default class Checkbox extends React.Component<Props> {
    render() {
        return <label className={`custom-control custom-checkbox ${this.props.className}`}>
            <input className="custom-control-input"
                type="checkbox"
                name={this.props.name}
                checked={this.props.checked}
                value={this.props.value}
                onChange={this.props.onChange}
            />
            <span className="custom-control-indicator" style={{border: "1px solid rgba(0,0,255,0.2)"}}></span>
            <span className="custom-control-description">{this.props.children}</span>
        </label>
    }
}