import React from 'react';
import logo from '../../assets/congestion-charge.png';
import './styles/congestion-charge.scss';

export default function CongestionCharge() {
    return <img className="congestion-charge" src={logo} alt="Congestion charge" title="Congestion charge applies" />;
}
