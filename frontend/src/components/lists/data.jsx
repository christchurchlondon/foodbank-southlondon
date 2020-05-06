import React from 'react';
import ListItemNotes from './item-notes';


export default class ListsData extends React.Component {

    render() {

        const tableRows = this.props.data.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.description}</td>
                    <td>
                        { item.householdSizes.single.quantity }
                        <ListItemNotes notes={item.householdSizes.single.notes} />
                    </td>
                    <td>
                        { item.householdSizes.familyOf2.quantity }
                        <ListItemNotes notes={item.householdSizes.familyOf2.notes} />
                    </td>
                    <td>
                        { item.householdSizes.familyOf3.quantity }
                        <ListItemNotes notes={item.householdSizes.familyOf3.notes} />
                    </td>
                    <td>
                        { item.householdSizes.familyOf4.quantity }
                        <ListItemNotes notes={item.householdSizes.familyOf4.notes} />
                    </td>
                    <td>
                        { item.householdSizes.familyOf5Plus.quantity }
                        <ListItemNotes notes={item.householdSizes.familyOf5Plus.notes} />
                    </td>
                </tr>
            );
        })

        return (
            <table className="lists-data">
                <thead>
                    <tr>
                        <th rowSpan="2">Description</th>
                        <th colSpan="5" className="first">Quantities and Notes</th>
                    </tr>
                    <tr>
                        <th>Single</th>
                        <th>Family of 2</th>
                        <th>Family of 3</th>
                        <th>Family of 4</th>
                        <th>Family of 5+</th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        );
    }

}
