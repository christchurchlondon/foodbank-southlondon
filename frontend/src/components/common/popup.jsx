import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/popup.scss';


export default class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
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

    confirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
    }

    close() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    boxClickHandler(event) {
        event.stopPropagation();
    }

    keyDownHandler(event) {
        switch (event.keyCode) {
            case 13:
                this.confirm();
                break;
            case 27:
                this.close();
                break;
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

    getHeader() {
        const icon = this.props.icon ? <FontAwesomeIcon icon={ this.props.icon } className="popup-header-icon" /> : null;
        return <header className="popup-header">
            <h3>{ icon }{ this.props.title }</h3>
            { this.getCloseButton() }
        </header>;
    }

    getFooter() {
        const buttons = this.getButtons();
        return buttons.length > 0
            ? <footer className="popup-footer">{ buttons }</footer>
            : null;
    }

    getCloseButton() {
        return this.props.canClose === false
            ? null
            : (
                <button className="close danger btn-small" onClick={ this.close }>
                    <FontAwesomeIcon icon="times" />
                </button>
            );
    }

    render() {
        return (
            <div className="popup-wrapper" onClick={ this.close }>
                <div className="popup-box" onClick={ this.boxClickHandler }>
                    { this.getHeader() }
                    <main>
                        { this.props.children }
                    </main>
                    { this.getFooter() }
                </div>
            </div>
        );
    }

}
