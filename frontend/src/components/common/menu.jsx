import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/menu.scss';

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
        this.state = { show: false };
    }

    componentDidMount() {
        document.addEventListener('click', this.onClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside, false);
    }

    toggle() {
        this.setState({ show: !this.state.show });
    }

    close() {
        this.setState({ show: false });
    }

    onClickOutside(ev) {
        if(this.state.show && this.ref) {
            const contains = this.ref.contains(ev.target);

            if(!contains) {
                this.close();
            }
        }
    }

    getMenu() {
        const items = this.props.options.map((option, index) => {
            if(React.isValidElement(option)) {
                return <li key={index}>{option}</li>;
            } else {
                return <li key={index} onClick={ () => {
                    option.action();
                    this.close();
                } }>{ option.label }</li>;
            }
        });
        return (
            <ul className={`menu-list ${this.props.alignLeft ? '' : 'right'}`}>
                { items }
            </ul>
        );
    }

    render() {
        return (
            <div className="menu" ref={r => this.ref = r}>
                <button className={`${this.props.className || ''} toggle`} disabled={ this.props.disabled || this.props.loading } onClick={ this.toggle }>
                    { this.props.label }
                    <FontAwesomeIcon
                        icon={
                            this.props.icon || (this.state.show ? 'chevron-up' : 'chevron-down')
                        }
                        className="toggle-icon"
                    />
                </button>
                { this.state.show && this.getMenu() }
            </div>
        );

    }
}

