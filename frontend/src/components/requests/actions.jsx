import React from 'react';
import Select from 'react-select';
import './styles/actions.scss';

export default class RequestsActions extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.doAction = this.doAction.bind(this);
        this.state = { value: null };
    }

    handleChange(option) {
        const value = this.props.events.find(e => e.name === option.value);
        this.setState({ value });
    }

    doAction() {
        if (!!this.state.value) {
            this.props.onAction(this.state.value);
        }
    }

    render() {

        const options = this.props.events
            .map(event => event.name)
            .map(name => ({
                value: name,
                label: name
            }));

        const disableButton = this.props.disabled || !this.state.value;

        return (
            <div className="requests-actions panel">
                <label>Select action</label>
                <Select
                    value={ this.state.value }
                    options={ options }
                    className="requests-select"
                    onChange={ this.handleChange } />
                <button disabled={ disableButton } onClick={ this.doAction }>Submit</button>
            </div>
        );
    }

}
