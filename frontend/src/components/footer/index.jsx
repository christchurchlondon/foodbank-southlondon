import React from 'react';
import Popup from '../common/popup';
import './styles/index.scss';

export default class Footer extends React.Component {

    timeout = null;

    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
        this.state = { show: false };
    }

    click(event) {
        if (event.shiftKey) {
            const show = this.show.bind(this);
            document.addEventListener('keypress', show);
            this.timeout = setTimeout(
                () => { document.removeEventListener('keypress', show) },
                500
            );
        }
    }

    show(e) {
        e.keyCode === 117 && this.setState({ show: true });
    }

    hide() {
        this.setState({ show: false });
    }

    render() {
        return (
            <footer className="footer">
                <p>
                    Application by A, D, D & <span onClick={ this.click.bind(this) }>M</span>
                    <a href="https://vauxhall.foodbank.org.uk/" rel="noopener noreferrer" target="_blank">Vauxhall Foodbank</a>
                    <a href="https://www.trusselltrust.org/" rel="noopener noreferrer" target="_blank">Trussell Trust</a>
                </p>
                { this.state.show && <Popup title="About" onClose={ this.hide.bind(this) }>
                    Application created by Adam, Dan, Dan and Michael for The Trussell Trust food bank in South London, who do great work for the community. 
                    This was made possible with support from ChristChurch London.
                </Popup> }
            </footer>
        );
    }
}
