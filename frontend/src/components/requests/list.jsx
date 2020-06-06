import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT_UI } from '../../constants';

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

    render() {

        const data = this.props.requests;

        const tableRows = data.map(item => {
            const request = item.data;
            return (
                <tr key={request.id} onClick={ () => this.props.onSelect(request.id) }>
                    <td className="selection-cell" onClick={ this.handleCheckboxCellClick }>
                        <input type="checkbox"
                            onChange={ () => this.toggle(request.id) }
                            onClick={ this.handleCheckboxClick }
                            checked={ item.checked } />
                    </td>
                    <td>{ request.fullName }</td>
                    <td>{ request.postcode }</td>
                    <td>{ format(request.deliveryDate, DATE_FORMAT_UI) }</td>
                    <td>{ request.referenceNumber }</td>
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
                        <th>Postcode</th>
                        <th>Delivery Date</th>
                        <th>Reference #</th>
                        <th>Last Status</th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        )
    }

}


