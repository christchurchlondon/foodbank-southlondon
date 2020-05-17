import React from 'react';
import './styles/filter-field.scss';


export default class FilterField extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = { value: this.props.value || '' };
    }

    onChange(event) {
        const value = event.target.value;
        this.setState({ value })
        this.props.onChange(value);
    }

    render() {
        return (
            <div className="filter-field">
                <label>{ this.props.label }</label>
                <input type="text"
                    value={ this.state.value }
                    onChange={ this.onChange } />
            </div>
        );
    }
}
