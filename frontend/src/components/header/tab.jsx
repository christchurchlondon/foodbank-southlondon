import React from 'react';

export default function Tab(props) {
    return (
        <a className="tab" onClick={ props.onClick }>
            { props.name }
        </a>
    );
}
