import React from 'react';
import { connect } from 'react-redux';
import Tabs from './tabs';
import { setTab } from '../../redux/actions';
import { getTab } from '../../redux/selectors';
import logo from '../../assets/logo.png';
import './styles/index.scss';

class Header extends React.Component {

    // TODO remove state management from here?

    handleTabSelect(tab) {
        this.props.setTab(tab);
    }

    render() {
        return (
            <header className="header">
                <img className="logo" src={logo} alt="Lambeth Foodbank" />
                <Tabs onSelect={ tab => this.handleTabSelect(tab) } selected={ this.props.tab } />
                <a className="logout" href="/logout">Log out</a>
            </header>
        );
    };
}

const mapStateToProps = state => {
    const tab = getTab(state);
    return { tab };
}

export default connect(
    mapStateToProps,
    { setTab }
)(Header);
