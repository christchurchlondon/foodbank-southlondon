import React from 'react';
import './styles/actions.scss';

export default class RequestsActions extends React.Component {

    doAction() {
        // TODO
        console.log('Action button clicked');
    }    

    render() {

        // TODO populate these from the endpoint

        const options = this.props.events.map((event, index) => {
            return <option key={index} value={event}>{ event }</option>;
        });

        return (
            <div className="requests-actions panel">
                <label>Select action</label>
                <select>{ options }</select>
                <button onClick={ this.doAction }>Submit</button>
            </div>
        );
    }

}
