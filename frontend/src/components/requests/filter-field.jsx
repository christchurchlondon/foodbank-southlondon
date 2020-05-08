import React from 'react';
import './styles/filter-field.scss';


// TODO pass value down, persist it?

export default function FilterField(props) {
    return (
        <div className="filter-field">
            <label>{ props.label }</label>
            <input type="text" onChange={ props.onChange } />
        </div>
    );
}
