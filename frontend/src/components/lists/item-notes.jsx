import React from 'react';
import './styles/item-notes.css';


export default class ListItemNotes extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { show: false };
    }

    toggle() {

        // TODO manage this rendering via Redux?

        this.setState({ show: !this.state.show });
    }

    render() {

        const notes = this.props.notes || '';

        if (notes.trim().length === 0) return null;

        // TODO speech bubble icon

        const notesText = this.state.show
            ? <div className="list-item-notes-text">{ this.props.notes }</div>
            : null;

        return (
            <span className="list-item-notes">
                <span className="toggle" onClick={ () => this.toggle() }>[notes]</span>
                { notesText }
            </span>
        );
    }

}