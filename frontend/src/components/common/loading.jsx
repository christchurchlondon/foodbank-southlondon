import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/loading.scss';

export default function Loading(props) {
    return (
        <p className="loading">
            <FontAwesomeIcon icon="spinner" className="icon" spin />
            { props.compact ? '' : 'Loading...'}
        </p>
    );
}
