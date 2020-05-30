import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import './styles/tab.scss';

export default function Tab(props) {

    const selected = useRouteMatch({
        path: props.path,
        exact: true
    });

    return (
        <span className={ 'tab' + (selected ? ' selected' : '') } >
            <Link to={props.path}>{ props.name }</Link>
        </span>
    );
}
