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

    handleCheckboxClick(event) {
        event.stopPropagation();
    }

    render() {

        // TODO add page number, extend button, clickable rows

        const tableRows = this.props.requests.map(item => {
            const request = item.data;
            return (
                <tr key={request.id} onClick={ () => this.props.onSelect(request.id) }>
                    <td>
                        <input type="checkbox"
                            onChange={ () => this.toggle(request.id) }
                            onClick={ this.handleCheckboxClick }
                            checked={ item.checked } />
                    </td>
                    <td>{ request.fullName }</td>
                    <td>{ request.postcode }</td>
                    <td>{ format(request.deliveryDate, DATE_FORMAT_UI) }</td>
                    <td>{ request.referenceNumber }</td>
                </tr>
            );
        });

        const allChecked = this.props.requests.every(item => item.checked);

        return (
            <table className="requests-list selectable padded">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox"
                                onChange={ () => this.toggleAll() }
                                onClick={ this.handleCheckboxClick }
                                checked={ allChecked }/>
                        </th>
                        <th>Name</th>
                        <th>Postcode</th>
                        <th>Delivery Date</th>
                        <th>Reference #</th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        )
    }

}


