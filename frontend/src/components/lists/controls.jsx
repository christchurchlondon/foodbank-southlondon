import React from 'react';
import './styles/controls.scss';


export default function ListsControls(props) {
    return (
        <section className="lists-controls panel">
            <button onClick={ props.onSave }>Save</button>
        </section>
    );
}
