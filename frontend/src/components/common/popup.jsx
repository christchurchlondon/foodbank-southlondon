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
        this.setContentsMaxHeight = this.setContentsMaxHeight.bind(this);

        this.state = {
            height: 0
        };

        this.headerRef = React.createRef();
        this.footerRef = React.createRef();

        window.addEventListener('resize', this.setContentsMaxHeight);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownHandler, false);
        this.setContentsMaxHeight();
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

    setContentsMaxHeight() {
        const header = this.headerRef.current || { clientHeight: 0 };
        const footer = this.footerRef.current || { clientHeight: 0 };
        const height = window.innerHeight
            - header.clientHeight
            - footer.clientHeight
            - 80;
        this.setState({ height })
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
        return <header className="popup-header" ref={ this.headerRef }>
            <h3>{ icon }{ this.props.title }</h3>
            { this.getCloseButton() }
        </header>;
    }

    getFooter() {
        const buttons = this.getButtons();
        return buttons.length > 0
            ? <footer className="popup-footer" ref={ this.footerRef }>{ buttons }</footer>
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
                    <main className="popup-main" style={ { maxHeight: this.state.height } }>
                        { this.props.children }
                    </main>
                    { this.getFooter() }
                </div>
            </div>
        );
    }

}
