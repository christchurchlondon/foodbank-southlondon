import React from 'react';
import Tabs from './tabs';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/index.scss';

export default function Header() {
    return (
        <header className="header">
            <img className="logo" src={logo} alt="Lambeth Foodbank" />
            <Tabs />
            <a className="logout" href="/logout">
                Log out
                <FontAwesomeIcon icon="sign-out-alt" className="logout-icon" />
            </a>
        </header>
    );
}
