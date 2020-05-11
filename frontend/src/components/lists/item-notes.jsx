import React from 'react';
import './styles/item-notes.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class ListItemNotes extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    isSelectedComment() {
        return !!this.props.selected;
    }

    toggle(event) {
        this.props.onToggle();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleNoteClick(event) {
        event.nativeEvent.stopImmediatePropagation();
    }

    render() {

        const notes = this.props.notes || '';

        if (notes.trim().length === 0) return null;

        const notesText = this.props.selected
            ? <div className="list-item-notes-text" onClick={this.handleNoteClick}>{ this.props.notes }</div>
            : null;

        return (
            <span className="list-item-notes">
                <span className="toggle" onClick={ this.toggle }>
                    <FontAwesomeIcon icon="comment" />
                </span>
                { notesText }
            </span>
        );
    }

}