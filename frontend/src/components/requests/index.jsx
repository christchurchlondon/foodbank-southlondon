import React from 'react';
import { connect } from 'react-redux';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests } from '../../redux/actions';

class Requests extends React.Component {
    
    componentDidMount() {
        this.props.fetchRequests();
    }

    render() {

        // TODO create component for this
        const requestItems = this.props.items
            .map(item => <p key={item}>{ item }</p>);

        return (
            <div>
                <h2>Requests</h2>
                <p>TODO: Filters</p>
                { requestItems }
                <p>TODO: Actions</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getRequestsState(state);
}

export default connect(
    mapStateToProps,
    { fetchRequests }
)(Requests);
