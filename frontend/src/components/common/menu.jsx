import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/menu.scss';

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.state = { show: false };
    }

    componentDidMount() {
        document.addEventListener('click', this.close, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.close, false);
    }

    toggle() {
        this.setState({ show: !this.state.show });
    }

    close() {
        this.setState({ show: false });
    }

    handleToggleClick(event) {
        this.toggle();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleMenuClick(event) {
        this.close();
        event.nativeEvent.stopImmediatePropagation();
    }

    getMenu() {
        const items = this.props.options.map((option, index) => {
            if(React.isValidElement(option)) {
                return <li key={index}>{option}</li>;
            } else {
                return <li key={index} onClick={ option.action }>{ option.label }</li>;
            }
        });
        return (
            <ul className="menu-list right" onClick={ this.handleMenuClick }>
                { items }
            </ul>
        );
    }

    render() {
        return (
            <div className="menu">
                <button className="primary toggle" disabled={ this.props.disabled } onClick={ this.handleToggleClick }>
                    { this.props.label }
                    <FontAwesomeIcon icon="chevron-down" className="toggle-icon" />
                </button>
                { this.state.show && this.getMenu() }
            </div>
        );

    }
}

