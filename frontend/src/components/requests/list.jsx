import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT_UI } from '../../constants';

export default class RequestsList extends React.Component {

    handleCheckAllClick(event) {

    }

    handleCheckboxClick(event) {
        event.stopPropagation();
    }

    render() {

        // TODO add page number, extend button, clickable rows

        const tableRows = this.props.requests.map(request => {
            return (
                <tr key={request.id} onClick={ () => this.props.onSelect(request.id) }>
                    <td>{ request.referenceNumber }</td>
                    <td>{ request.fullName }</td>
                    <td>{ request.postcode }</td>
                    <td>{ format(request.deliveryDate, DATE_FORMAT_UI) }</td>
                    <td>
                        <input type="checkbox" onClick={ this.handleCheckboxClick } />
                    </td>
                </tr>
            );
        });

        return (
            <table className="requests-list selectable">
                <thead>
                    <tr>
                        <th>Reference #</th>
                        <th>Name</th>
                        <th>Postcode</th>
                        <th>Delivery Date</th>
                        <th>
                            <input type="checkbox" onClick={ this.handleCheckAllClick } />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        )
    }

}


