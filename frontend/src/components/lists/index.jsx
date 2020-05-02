import React from 'react';
import { connect } from 'react-redux';
import { getListsState } from '../../redux/selectors';

class Lists extends React.Component {
    render() {
        return (
            <div>
                <h2>Lists</h2>
                <p>TODO: General comments</p>
                <p>TODO: Items</p>
                <p>TODO: Save button</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getListsState(state);
}

export default connect(
    mapStateToProps
    // TODO actions
)(Lists);
