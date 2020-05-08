import React from 'react';
import './styles/popup.scss';


export default class Popup extends React.Component {

    // TODO dismiss on click/esc etc

    render() {
        return (
            <div class="popup-wrapper">
                <div class="popup-box">
                    <header>
                        <h3>{ this.props.title }</h3>
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
