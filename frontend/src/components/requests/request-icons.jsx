import React from "react";

import congestionChargeLogo from '../../assets/congestion-charge.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RequestIcons({ request }) {
    const icons = [];

    if(request.collectionCentre) {
        const alt = `Collection at ${request.collectionCentre}`;
        icons.push(<FontAwesomeIcon className='inline-icon' icon='shoe-prints' title={alt} alt={alt} />);
    } else {
        icons.push(<FontAwesomeIcon className='inline-icon' icon='truck' title='Delivery' alt='Delivery' />);
    }

    if(request.isInCongestionZone && !request.collectionCentre) {
        icons.push(<img className="inline-icon" src={congestionChargeLogo} alt="Congestion charge" title="Congestion charge applies" />);
    }

    return <React.Fragment>
        { icons }
    </React.Fragment>;
}