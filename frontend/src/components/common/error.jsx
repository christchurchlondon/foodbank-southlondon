import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/error.scss';

export default function Error(props) {
    return (
        <div className="error">
            <FontAwesomeIcon icon="exclamation-circle" className="error-icon" />
            <p className="error-message">{ props.message || 'Error' }</p>
        </div>
    );
}