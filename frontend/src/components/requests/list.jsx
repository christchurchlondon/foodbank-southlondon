import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT_UI } from '../../constants';
import CongestionCharge from '../common/congestion-charge';
import './styles/list.scss';

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

    extractEvent(event) {
        if (!event.name) return '';
        const date = format(event.date, DATE_FORMAT_UI);
        return !!event.data
            ? `${ event.name } (${ event.data }) @ ${ date }`
            : `${ event.name } @ ${ date }`;
    }

    getEmptyRow() {
        return (
            <tr className="empty-row">
                <td colSpan="6">No results</td>
            </tr>
        );
    }

    render() {

        const data = this.props.requests;

        const tableRows = data.map(item => {
            const request = item.data;
            const disabled = !request.id.length;
            const onClick = disabled ? undefined : () => this.props.onSelect(request.id);
            return (
                <tr key={request.id} onClick={ onClick } className={ disabled ? 'disabled' : '' }>
                    <td className="selection-cell" onClick={ this.handleCheckboxCellClick }>
                        <input type="checkbox"
                            disabled={disabled}
                            onChange={ () => this.toggle(request.id) }
                            onClick={ this.handleCheckboxClick }
                            checked={ item.checked } />
                    </td>
                    <td>{ request.fullName }</td>
                    <td>{ request.householdSize }</td>
                    <td>
                        { request.postcode }
                        { request.isInCongestionZone && <CongestionCharge /> }
                    </td>
                    <td>{ format(request.packingDate, DATE_FORMAT_UI) }</td>
                    <td>{ request.timeOfDay }</td>
                    <td>{ this.extractEvent(request.event) }</td>
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
                        <th>Name</th>
                        <th>Family Size</th>
                        <th>Postcode</th>
                        <th>Packing Date</th>
                        <th>Time</th>
                        <th>Last Status</th>
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


