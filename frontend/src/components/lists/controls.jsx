import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/controls.scss';


export default function ListsControls(props) {
    return (
        <section className="lists-controls panel">
            <button className="add" onClick={ props.onAdd }>
                <FontAwesomeIcon icon="plus" />Add
            </button>
            <button className="primary save" onClick={ props.onSave }>Save</button>
        </section>
    );
}
