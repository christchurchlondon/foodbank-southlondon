import React from 'react';
import Menu from '../common/menu';
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
            .map(event => ({
                label: event.name,
                action: () => this.props.onAction(event)
            }));

        const label = this.props.recordCount
            ? `${this.props.recordCount} clients selected`
            : 'No clients selected';

        return (
            <div className="requests-actions panel">
                <Menu options={options}
                    label={label}
                    disabled={ !this.props.recordCount } />
            </div>
        );
    }

}
