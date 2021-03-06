import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
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
                <Icon icon="search" className="search-icon" />
                <input type="text"
                    placeholder={ this.props.label }
                    value={ this.state.value }
                    onChange={ this.handleChange }
                    onKeyDown={ this.handleKeyDown } />
            </div>
        );
    }
}
