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
            <span className="custom-control-indicator"></span>
            <span className="custom-control-description">{this.props.children}</span>
        </label>
    }
}