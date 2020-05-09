import React from 'react';
import './styles/tab.css';

export default function Tab(props) {
    return (
        <span className={ 'tab' + (props.isSelected ? ' selected' : '') } onClick={ props.onClick }>
            { props.name }
        </span>
    );
}
