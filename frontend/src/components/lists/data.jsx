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
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.move = this.move.bind(this);
        this.delete = this.delete.bind(this);

        this.state = {};

        // Drag and drop won't work in Safari if we try to construct the image inline
        // and empty. The workaround is to use an empty GIF as the source for the image
        // and build it before the drag operations are started
        this.transparentDragImage = new Image();
        this.transparentDragImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }

    selectComment(id, type) {
        this.props.onSelect(id, type);
    }

    edit(item) {
        this.props.onEdit(item.id);
    }

    onDragStart(e, item) {
        // Hide default thumbnail
        e.dataTransfer.setDragImage(this.transparentDragImage, 0, 0);

        this.setState({
            draggingItem: item,
            draggingData: this.props.data
        });
    }

    onDragEnter(e, draggedOverId) {
        // Required so that onDrop fires (https://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html)
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copyMove';

        const { draggingItem } = this.state;

        if(draggingItem.id !== draggedOverId) {
            const draggingData = this.state.draggingData.filter(item => item.id !== draggingItem.id);

            const dropId = this.state.draggingData.findIndex(item => item.id === draggedOverId);
            draggingData.splice(dropId, 0, this.state.draggingItem);

            this.setState({ draggingData });
        }
    }

    onDragOver(e) {
        // Required so that onDrop fires (https://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html)
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copyMove';
    }

    onDrop() {
        const { draggingItem } = this.state;

        const pos = this.props.data.indexOf(draggingItem);
        const newPos = this.state.draggingData.indexOf(draggingItem);

        this.move(pos, newPos);
        this.setState({ draggingData: undefined, draggingItem: undefined });
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

        const draggingId = this.state.draggingItem ? this.state.draggingItem.id : undefined; 
        const data = this.state.draggingData || this.props.data;

        const tableRows = data.map((item, rowIndex) => {
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
                    className={item.id === draggingId ? 'dragging-item' : ''}
                    // preventDefault calls required to get onDrop to fire
                    onDragEnter={(e) => this.onDragEnter(e, item.id)}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                >
                    <td
                        className="action-cell action-cell-draggable"
                        draggable
                        onDragStart={(e) => this.onDragStart(e, item)}
                    >
                        <FontAwesomeIcon icon="bars" />
                    </td>
                    <td>{ item.description }</td>
                    { cells }
                    <td className="action-cell">
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
                        <th></th>
                        <th rowSpan="2">Description</th>
                        <th colSpan="5" className="first">Quantities and Notes</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th></th>
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
