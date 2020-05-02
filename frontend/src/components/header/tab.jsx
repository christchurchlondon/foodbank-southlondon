import React from 'react';
import './styles/tab.css';

export default function Tab(props) {
    return (
        <a className={ 'tab' + (props.isSelected ? ' selected' : '') } onClick={ props.onClick }>
            { props.name }
        </a>
    );
}
