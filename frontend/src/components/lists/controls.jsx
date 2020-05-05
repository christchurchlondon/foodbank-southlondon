import React from 'react';


export default function ListsControls(props) {

    // TODO use shared button component

    return (
        <section className="lists-controls">
            <button onClick={ props.onSave }>Save</button>
        </section>
    );
}
