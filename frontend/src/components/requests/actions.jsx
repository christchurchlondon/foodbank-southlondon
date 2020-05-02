import React from 'react';

export default class RequestsActions extends React.Component {

    render() {
        return (
            <div className="requests-actions panel">

                <label>Select action</label>

                <select>
                    <option value="action-1">Action 1</option>
                    <option value="action-2">Action 2</option>
                    <option value="action-3">Action 3</option>
                </select>

                <button>GO</button>

            </div>
        );
    }

}
