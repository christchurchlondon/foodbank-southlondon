import React from "react";

import congestionChargeLogo from '../../assets/congestion-charge.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RequestIcons({ request }) {
    const icons = [];

    if(request.collectionCentre) {
        const alt = `Collection at ${request.collectionCentre}`;
        const icon = <FontAwesomeIcon
            key='collection'
            className='inline-icon'
            icon='shoe-prints'
            title={alt}
            alt={alt}
        />;
        
        icons.push(icon);
    } else {
        const icon = <FontAwesomeIcon
            key='delivery'
            className='inline-icon'
            icon='truck'
            title='Delivery'
            alt='Delivery'
        />;

        icons.push(icon);
    }

    if(request.isInCongestionZone && !request.collectionCentre) {
        const icon = <img
            key='congestion_charge'
            className='inline-icon'
            src={congestionChargeLogo}
            alt='Congestion charge'
            title='Congestion charge applies'
        />;

        icons.push(icon);
    }

    return <React.Fragment>
        { icons }
    </React.Fragment>;
}