import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { COLLECTION_CENTRES_FILTER_KEY, DATE_FORMAT_UI, STATUSES_FILTER_KEY, TIME_OF_DAY_FILTER_KEY } from '../../constants';
import Flag from './flag';
import './styles/list.scss';
import { FilterFieldValues } from '../lists/value-filters';
import Loading from '../common/loading';
import { RequestIconCell } from './request-icons';

export function extractEvent(event) {
    if (!event.name) return '';
    const date = format(event.date, DATE_FORMAT_UI);
    return !!event.data
        ? `${ event.name } (${ event.data }) @ ${ date }`
        : `${ event.name } @ ${ date }`;
}

export default class RequestsList extends React.Component {

    toggle(id) {
        this.props.onToggle(id);
    }

    toggleAll() {
        this.props.onToggleAll();
    }

    handleCheckboxCellClick(event) {
        event.stopPropagation();
    }

    handleCheckboxClick(event) {
        event.stopPropagation();
    }

    getEmptyRow() {
        return (
            <tr className="empty-row">
                <td colSpan="6">
                    {this.props.loading ? <Loading /> : "No results"}
                </td>
            </tr>
        );
    }

    refresh = () => {
        if(!this.props.loading) {
            this.props.onRefresh();
        }
    }

    render() {

        const data = this.props.requests;

        const tableRows = data.map((item, ix) => {
            const request = item.data;
            const disabled = !request.id.length;

            const nextRequest = this.props.requests[ix + 1] ? this.props.requests[ix + 1].data : undefined;

            const showDivider = nextRequest &&
                (nextRequest.timeOfDay !== request.timeOfDay ||
                 nextRequest.packingDate.getTime() !== request.packingDate.getTime());

            const className = (disabled ? 'disabled' : '') + (showDivider ? 'row-with-divider-below' : '');
            const onClick = disabled ? undefined : () => this.props.onSelect(request.id);

            return (
                <tr key={request.id} onClick={ onClick } className={className}>
                    <td className="selection-cell" onClick={ this.handleCheckboxCellClick }>
                        <input type="checkbox"
                            disabled={disabled}
                            onChange={ () => this.toggle(request.id) }
                            onClick={ this.handleCheckboxClick }
                            checked={ item.checked } />
                    </td>
                    <td className="cell-trim">
                        { request.flagForAttention && <Flag /> }
                    </td>
                    <td>
                        { request.fullName }
                    </td>
                    <td>{ request.householdSize }</td>
                    <td>
                        { request.postcode }
                    </td>
                    <RequestIconCell request={request} />
                    <td>{ format(request.packingDate, DATE_FORMAT_UI) }</td>
                    <td>{ request.timeOfDay }</td>
                    <td>{ extractEvent(request.event) }</td>
                </tr>
            );
        });

        const hasData = data.length > 0;
        const allChecked = data.every(item => item.checked);

        return (
            <table className="requests-list selectable">
                <thead>
                    <tr>
                        <th className="selection-cell">
                            <input type="checkbox"
                                onChange={ () => this.toggleAll() }
                                onClick={ this.handleCheckboxClick }
                                disabled={ !hasData }
                                checked={ hasData && allChecked } />
                        </th>
                        <th className="cell-trim"></th>
                        <th>Name</th>
                        <th>Family</th>
                        <th>Postcode</th>
                        <th>
                            <FilterFieldValues attribute={COLLECTION_CENTRES_FILTER_KEY} />
                        </th>
                        <th>Packing Date</th>
                        <th>
                            <div className="cell-with-actions">
                                Time
                                <div className="cell-actions">
                                    <FilterFieldValues attribute={TIME_OF_DAY_FILTER_KEY} />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="cell-with-actions">
                                Last Status
                                <div className="cell-actions">
                                    <FilterFieldValues attribute={STATUSES_FILTER_KEY} />
                                </div>
                                <button onClick={this.refresh}>
                                    <Icon
                                        icon="sync"
                                        title="Refresh"
                                        spin={this.props.loading}
                                    />
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                    { !hasData && this.getEmptyRow() }
                </tbody>
            </table>
        )
    }

}


