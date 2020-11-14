import React from 'react';
import Menu from '../common/menu';
import './styles/actions.scss';

export default class RequestsActions extends React.Component {

    render() {

        const statusOptions = this.props.statuses.items
            .map(status => ({
                label: status.name || 'No status',
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
            <div className="requests-actions">
                <div className="panel">
                    <Menu options={statusOptions}
                        label={label}
                        disabled={ !this.props.recordCount } />
                </div>
                <div className="panel">
                    <Menu options={actionOptions}
                        label={label}
                        disabled={ !this.props.recordCount } />
                </div>
            </div>
        );
    }

}
