import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItemNotes from './item-notes';
import './styles/data.scss';

const columns = [
    'familyOf1',
    'familyOf2',
    'familyOf3',
    'familyOf4',
    'familyOf5',
    'familyOf6',
    'familyOf7',
    'familyOf8',
    'familyOf9',
    'familyOf10Plus',
];

export default class ListsData extends React.Component {

    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
        this.move = this.move.bind(this);
        this.delete = this.delete.bind(this);
    }

    selectComment(id, type) {
        this.props.onSelect(id, type);
    }

    edit(item) {
        this.props.onEdit(item.id);
    }

    move(pos, newPos) {
        if (newPos < 0 || newPos >= this.props.data.length) return;
        this.props.onReorder(pos, newPos);
    }

    delete(item) {
        this.props.onDelete(item.id);
    }

    render() {

        const { id, type } = this.props.selectedComment || { id: null, type: null };
        const length = this.props.data.length;

        const tableRows = this.props.data.map((item, rowIndex) => {
            const isSelected = t => id === rowIndex && t === type;
            const cells = columns.map((col, colIndex) => {
                return (
                    <td key={ `${rowIndex}-${colIndex}` }>
                        { item.householdSizes[col].quantity }
                        <ListItemNotes
                            selected={ isSelected(col) }
                            onToggle={ () => this.selectComment(rowIndex, col) }
                            notes={ item.householdSizes[col].notes } />
                    </td>
                );
            });

            return (
                <tr
                    key={rowIndex}
                >
                    <td>{ item.description }</td>
                    { cells }
                    <td className="action-cell">
                        <span className={ 'item-action' + (rowIndex === 0 ? ' disabled' : '') } onClick={ () => this.move(rowIndex, rowIndex - 1) }>
                            <FontAwesomeIcon icon="arrow-up" />
                        </span>
                        <span className={ 'item-action' + (rowIndex === length - 1 ? ' disabled' : '') } onClick={ () => this.move(rowIndex, rowIndex + 1) }>
                            <FontAwesomeIcon icon="arrow-down" />
                        </span>
                        <span className="item-action primary" onClick={ () => this.edit(item) }>
                            <FontAwesomeIcon icon="edit" />
                        </span>
                        <span className="item-action danger" onClick={ () => this.delete(item) }>
                            <FontAwesomeIcon icon="times" />
                        </span>
                    </td>
                </tr>
            );
        });

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
                        <th>Family of 5</th>
                        <th>Family of 6</th>
                        <th>Family of 7</th>
                        <th>Family of 8</th>
                        <th>Family of 9</th>
                        <th>Family of 10+</th>
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
