import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/popup.scss';


export default class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.boxClickHandler = this.boxClickHandler.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }

    close() {
        this.props.onClose();
    }

    boxClickHandler(event) {
        event.stopPropagation();
    }

    keyDownHandler(event) {
        if (event.keyCode === 27) {
            this.close();
        }
    }

    getButtons() {
        return (this.props.buttons || [])
            .map((button, index) => {
                return (
                    <button key={index}
                        className={'popup-button ' + button.className}
                        disabled={ button.disabled }
                        onClick={ button.onClick }>
                        { button.label }
                    </button>
                );
            });
    }

    render() {

        const buttons = this.getButtons();

        return (
            <div className="popup-wrapper" onClick={ this.close }>
                <div className="popup-box" onClick={ this.boxClickHandler }>
                    <header className="popup-header">
                        <h3>{ this.props.title }</h3>
                        <button className="close btn-small" onClick={ this.close }>
                            <FontAwesomeIcon icon="times" />
                        </button>
                    </header>
                    <main>
                        { this.props.children }
                    </main>
                    <footer className="popup-footer">
                        { buttons }
                    </footer>
                </div>
            </div>
        );
    }

}
