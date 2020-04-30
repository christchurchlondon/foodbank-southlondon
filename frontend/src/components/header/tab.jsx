import React from 'react';

export default function Tab(props) {
    return (
        <a className="tab { props.isSelected ? 'selected' : '' }" onClick={ props.onClick }>
            { props.name }
        </a>
    );
}
