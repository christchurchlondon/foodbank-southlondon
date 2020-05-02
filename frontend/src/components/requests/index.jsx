import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests } from '../../redux/actions';
import Loading from '../common/loading';

class Requests extends React.Component {
    
    componentDidMount() {
        this.props.fetchRequests();
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    render() {

        // TODO create component for this
        const requestItems = this.props.items
            .map(item => <p key={item}>{ item }</p>);

        const contents = this.isLoading()
            ? <Loading />
            : (
                <div>
                    <p>TODO: Filters</p>
                    { requestItems }
                    <p>TODO: Actions</p>
                </div>
            );

        return (
            <div className="requests-container">
                <h2>Requests</h2>
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
