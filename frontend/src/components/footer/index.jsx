import React from 'react';
import Popup from '../common/popup';
import './styles/index.scss';

export default class Footer extends React.Component {

    timeout = null;
    key = 'QXBwbGljYXRpb24gY3JlYXRlZCBieSBBZGFtLCBEYW4gYW5kIERhbiBmb3IgVGhlIFRydXNzZWxsIFRydXN0IGZvb2QgYmFuayBpbiBTb3V0aCBMb25kb24sIHdobyBkbyBncmVhdCB3b3JrIGZvciB0aGUgY29tbXVuaXR5LiAgVGhpcyB3YXMgbWFkZSBwb3NzaWJsZSB3aXRoIHN1cHBvcnQgZnJvbSBDaHJpc3RDaHVyY2ggTG9uZG9uIGFuZCBtYWRlIG5lY2Vzc2FyeSBieSB5ZWFycyBvZiBhdXN0ZXJpdHkgZnJvbSB0aGUgQ29uc2VydmF0aXZlIFBhcnR5Lg==';

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
            <footer>
                <p>
                    Application by A, D & <span onClick={ this.click.bind(this) }>D</span>
                    <a href="https://vauxhall.foodbank.org.uk/" rel="noopener noreferrer" target="_blank">Vauxhall Foodbank</a>
                    <a href="https://www.trusselltrust.org/" rel="noopener noreferrer" target="_blank">Trussell Trust</a>
                </p>
                { this.state.show && <Popup title="About" onClose={ this.hide.bind(this) }>{atob(this.key)}</Popup> }
            </footer>
        );
    }
}
