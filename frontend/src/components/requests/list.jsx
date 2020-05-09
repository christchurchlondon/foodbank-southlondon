import React from 'react';

export default class RequestsList extends React.Component {

    render() {

        // TODO show full data

        const tableRows = this.props.requests.map(request => {
            return (
                <tr key={request.id}>
                    <td>{ request.fullName }</td>
                    <td>{ request.referenceNumber }</td>
                    <td>[last status]</td>
                    <td>[checkbox]</td>
                </tr>
            );
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reference #</th>
                        <th>Last Status</th>
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


