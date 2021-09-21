import React from "react";

import congestionChargeLogo from '../../assets/congestion-charge.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RequestIconCell({ request }) {
    const icons = [];

    let title = '';

    if(request.collectionCentre) {
        title = `Collection at ${request.collectionCentre}`;

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
    </td>;
}