import React from 'react';
import Menu from '../common/menu';
import './styles/actions.scss';

export default class RequestsActions extends React.Component {

    render() {

        const statusOptions = this.props.statuses.items
            .map(status => ({
                label: status.name || 'No Status',
                action: () => this.props.onAction(status, 'status')
            }));

        const actionOptions = this.props.actions.items
            .map(action => ({
                label: action.name,
                action: () => this.props.onAction(action, 'action')
            }));

        const clients = this.props.recordCount === 1 ? 'client' : 'clients';

        const label = this.props.recordCount
            ? `${this.props.recordCount} ${clients} selected`
            : 'No clients selected';

        return (
            <div className="requests-actions panel">
                <label>{ label }</label>
                <Menu options={statusOptions}
                    className="primary"
                    label="Statuses"
                    disabled={ this.props.disabled || !this.props.recordCount } />
                <Menu options={actionOptions}
                    className="primary"
                    label="Actions"
                    disabled={ this.props.disabled || !this.props.recordCount } />
            </div>
        );
    }

}
