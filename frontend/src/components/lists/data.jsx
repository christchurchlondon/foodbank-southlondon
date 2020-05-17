import React from 'react';
import ListItemNotes from './item-notes';


export default class ListsData extends React.Component {

    selectComment(id, type) {
        this.props.onSelect(id, type);
    }

    render() {

        const { id, type } = this.props.selectedComment || { id: null, type: null };

        const tableRows = this.props.data.map((item, index) => {

            const [singleSelected, twoSelected, threeSelected, fourSelected, fivePlusSelected]
                = ['1', '2', '3', '4', '5+'].map(t => index === id && t === type);

            return (
                <tr key={index}>
                    <td>{item.description}</td>
                    <td>
                        { item.householdSizes.single.quantity }
                        <ListItemNotes
                            selected={singleSelected}
                            onToggle={ () => this.selectComment(index, '1') }
                            notes={item.householdSizes.single.notes}
                            onSelect={ this.selectComment } />
                    </td>
                    <td>
                        { item.householdSizes.familyOf2.quantity }
                        <ListItemNotes
                            selected={twoSelected}
                            onToggle={ () => this.selectComment(index, '2') }
                            notes={item.householdSizes.familyOf2.notes}
                            onSelect={ this.selectComment } />
                    </td>
                    <td>
                        { item.householdSizes.familyOf3.quantity }
                        <ListItemNotes
                            selected={threeSelected}
                            onToggle={ () => this.selectComment(index, '3') }
                            notes={item.householdSizes.familyOf3.notes}
                            onSelect={ this.selectComment } />
                    </td>
                    <td>
                        { item.householdSizes.familyOf4.quantity }
                        <ListItemNotes
                            selected={fourSelected}
                            onToggle={ () => this.selectComment(index, '4') }
                            notes={item.householdSizes.familyOf4.notes}
                            onSelect={ this.selectComment } />
                    </td>
                    <td>
                        { item.householdSizes.familyOf5Plus.quantity }
                        <ListItemNotes
                            selected={fivePlusSelected}
                            onToggle={ () => this.selectComment(index, '5+') }
                            notes={item.householdSizes.familyOf5Plus.notes}
                            onSelect={ this.selectComment } />
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
