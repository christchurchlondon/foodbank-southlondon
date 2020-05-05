import React from 'react';


export default class ListsData extends React.Component {

    render() {

        const tableRows = this.props.data.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.description}</td>
                    <td></td>
                </tr>
            );
        })

        return (
            <table className="lists-data">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        );
    }

}
