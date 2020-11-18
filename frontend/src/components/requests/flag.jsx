import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import './styles/flag.scss';

export default function Flag(props) {
    return <Icon icon="flag" className="flag" title="Flagged for attention" />;
}
