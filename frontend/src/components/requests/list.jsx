import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT_UI } from '../../constants';

export default class RequestsList extends React.Component {

    render() {

        // TODO show full data
        // ref #, name, postcode, delivery date, latest status, tickboxes

        // TODO add page number, extend button, clickable rows

        const tableRows = this.props.requests.map(request => {
            return (
                <tr key={request.id} onClick={ () => this.props.onSelect(request.id) }>
                    <td>{ request.referenceNumber }</td>
                    <td>{ request.fullName }</td>
                    <td>{ request.postcode }</td>
                    <td>{ format(request.deliveryDate, DATE_FORMAT_UI) }</td>
                    <td>[checkbox]</td>
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        )
    }

}


