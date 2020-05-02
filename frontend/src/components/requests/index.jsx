import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests } from '../../redux/actions';
import Loading from '../common/loading';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';

class Requests extends React.Component {
    
    componentDidMount() {
        this.props.fetchRequests();
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    render() {

        // TODO actions for child components

        const contents = this.isLoading()
            ? <Loading />
            : (
                <div>
                    <RequestsFilter />
                    <RequestsList requests={ this.props.items } />
                    <RequestsActions />
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
