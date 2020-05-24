import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItemNotes from './item-notes';
import './styles/data.scss';


export default class ListsData extends React.Component {

    constructor(props) {
        super(props);
        this.move = this.move.bind(this);
    }

    selectComment(id, type) {
        this.props.onSelect(id, type);
    }

    move(pos, newPos) {
        if (newPos < 0 || newPos >= this.props.data.length) return;
        this.props.onReorder(pos, newPos);
    }

    render() {

        const { id, type } = this.props.selectedComment || { id: null, type: null };
        const length = this.props.data.length;

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
                    <td>
                        <span className={ 'move' + (index === 0 ? ' disabled' : '') } onClick={ () => this.move(index, index - 1) }>
                            <FontAwesomeIcon icon="arrow-up" />
                        </span>
                        <span className={ 'move' + (index === length - 1 ? ' disabled' : '') } onClick={ () => this.move(index, index + 1) }>
                            <FontAwesomeIcon icon="arrow-down" />
                        </span>
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
                        <th></th>
                    </tr>
                    <tr>
                        <th>Single</th>
                        <th>Family of 2</th>
                        <th>Family of 3</th>
                        <th>Family of 4</th>
                        <th>Family of 5+</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
        );
    }

}
