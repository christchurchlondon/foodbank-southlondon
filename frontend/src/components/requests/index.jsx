import React from 'react';
import { connect } from 'react-redux';
import { getRequestsState } from '../../redux/selectors';

class Requests extends React.Component {
    render() {
        return (
            <div>
                <h2>Requests</h2>
                <p>TODO: Filters</p>
                <p>TODO: List</p>
                <p>TODO: Actions</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getRequestsState(state);
}

export default connect(
    mapStateToProps
    // TODO actions
)(Requests);
