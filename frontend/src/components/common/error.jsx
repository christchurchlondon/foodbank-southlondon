import React from 'react';
import './styles/error.scss';

export default function Error(props) {
    // TODO more styling, add icon
    return <p className="error">{ props.message || 'Error' }</p>
}