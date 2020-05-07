import React from 'react';
import './styles/actions.scss';

export default class RequestsActions extends React.Component {

    doAction() {
        // TODO
        console.log('Action button clicked');
    }    

    render() {
        return (
            <div className="requests-actions panel">

                <label>Select action</label>

                <select>
                    <option value="action-1">Action 1</option>
                    <option value="action-2">Action 2</option>
                    <option value="action-3">Action 3</option>
                </select>

                <button onClick={ this.doAction }>Go</button>

            </div>
        );
    }

}
