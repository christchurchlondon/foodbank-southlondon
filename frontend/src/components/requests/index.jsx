import React from 'react';
import { connect } from 'react-redux';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests } from '../../redux/actions';
import Loading from '../common/loading';

class Requests extends React.Component {
    
    componentDidMount() {
        this.props.fetchRequests();
    }

    render() {

        // TODO create component for this
        const requestItems = this.props.items
            .map(item => <p key={item}>{ item }</p>);

        // TODO make constants file for statuses
        const contents = this.props.status === 'loading'
            ? <Loading />
            : (
                <div>
                    <h2>Requests</h2>
                    <p>TODO: Filters</p>
                    { requestItems }
                    <p>TODO: Actions</p>
                </div>
            );

        return (
            <div className="requests-container">
                { contents }
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
