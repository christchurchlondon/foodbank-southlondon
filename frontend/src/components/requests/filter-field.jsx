import React from 'react';
import './styles/filter-field.scss';


export default class FilterField extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = { value: this.props.value || '' };
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({ value })
        this.props.onChange(value);
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) {
            this.props.onChange(event.target.value);
            this.props.onEnter();
        }
    }

    render() {
        return (
            <div className="filter-field">
                <label>{ this.props.label }</label>
                <input type="text"
                    value={ this.state.value }
                    onChange={ this.handleChange }
                    onKeyDown={ this.handleKeyDown } />
            </div>
        );
    }
}
