import React from "react";

import congestionChargeLogo from '../../assets/congestion-charge.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RequestIconCell({ request }) {
    const icons = [];

    let title = '';
    let text = null;

    if(request.collectionCentre) {
        title = `Collection at ${request.collectionCentre}`;
        text = request.collectionCentreAbbr;

        const icon = <FontAwesomeIcon
            key='collection'
            className='inline-icon'
            icon='shoe-prints'
            alt={title}
        />;
        
        icons.push(icon);
    } else {
        title = 'Delivery';

        const icon = <FontAwesomeIcon
            key='delivery'
            className='inline-icon'
            icon='truck'
            alt={title}
        />;

        icons.push(icon);
    }

    if(request.isInCongestionZone && !request.collectionCentre) {
        title = 'Congestion charge applies';

        const icon = <img
            key='congestion_charge'
            className='inline-icon'
            src={congestionChargeLogo}
            alt={title}
        />;

        icons.push(icon);
    }

    return <td title={title}>
        { icons }
        { text && <span className='inline-icon-text'>{text}</span> }
    </td>;
}