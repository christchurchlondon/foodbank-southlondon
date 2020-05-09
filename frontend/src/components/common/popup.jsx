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

    render() {
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
                    <footer>

                    </footer>
                </div>
            </div>
        );
    }

}
