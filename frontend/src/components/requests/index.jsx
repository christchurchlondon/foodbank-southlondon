import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING, STATUS_FAILED, STATUS_SUCCESS } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests, fetchSingleRequest } from '../../redux/actions';
import Loading from '../common/loading';
import Error from '../common/error';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';

class Requests extends React.Component {
    
    constructor(props) {
        super(props);
        this.fetchRequests = this.fetchRequests.bind(this);
    }

    componentDidMount() {
        // TODO only run if props.items is empty?
        this.fetchRequests();
    }

    fetchRequests(filters = {}) {
        this.props.fetchRequests(filters);
    }

    selectRequest(id) {
        this.props.fetchSingleRequest(id);
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    isFailed() {
        return this.props.status === STATUS_FAILED;
    }

    isSuccessful() {
        return this.props.status === STATUS_SUCCESS;
    }

    getContents() {
        if (this.isLoading()) return <Loading />;
        if (this.isFailed()) return <Error message={'Unable to load requests'} />;
        return this.getRequestsContents();
    }

    getRequestsContents() {
        return (
            <div>
                <RequestsFilter onSubmit={ v => this.fetchRequests(v) } value={this.props.filter} />
                <RequestsList requests={ this.props.items } />
                <RequestsActions />
            </div>
        );
    }

    render() {

        // TODO actions for child components
        // TODO refresh button?

        const contents = this.getContents();

        // TODO show popup selection
        // const popup = (this.props.selection.status === STATUS_LOADING || !!props.selection.item)
        //     ? <p>ADD NEW COMPONENT</p>
        //     : null;

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
    { fetchRequests, fetchSingleRequest }
)(Requests);
