import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/loading.scss';

export default function Loading() {
    return (
        <p className="loading">
            <FontAwesomeIcon icon="spinner" className="icon" spin />
            Loading...
        </p>
    );
}
