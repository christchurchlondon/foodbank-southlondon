import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING, STATUS_FAILED, STATUS_SUCCESS } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import {
    fetchRequests,
    fetchSingleRequest,
    clearRequestSelection,
    fetchEvents
} from '../../redux/actions';
import Loading from '../common/loading';
import Error from '../common/error';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';
import RequestSelection from './selection';

class Requests extends React.Component {
    
    constructor(props) {
        super(props);
        this.fetchRequests = this.fetchRequests.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
    }

    componentDidMount() {
        // TODO only run if props.items is empty?
        this.fetchRequests();
        this.fetchEvents();
    }

    fetchRequests(filters = {}) {
        this.props.fetchRequests(filters);
    }

    fetchEvents() {
        this.props.fetchEvents();
    }

    selectRequest(id) {
        this.props.fetchSingleRequest(id);
    }

    clearSelection() {
        this.props.clearRequestSelection();
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
                <RequestsList requests={ this.props.items } onSelect={ id => this.selectRequest(id) } />
                <RequestsActions status={ this.props.events.status } events={ this.props.events.items } />
            </div>
        );
    }

    getRequestSelection() {
        return <RequestSelection
            status={ this.props.selection.status }
            item={ this.props.selection.item }
            onClose={ () => this.clearSelection() } />
    }

    render() {

        // TODO actions for child components
        // TODO refresh button?

        const contents = this.getContents();

        const selection = this.getRequestSelection();

        return (
            <div className="requests-container">
                <h2>Requests</h2>
                { contents }
                { selection }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getRequestsState(state);
}

export default connect(
    mapStateToProps, {
        fetchRequests,
        fetchSingleRequest,
        clearRequestSelection,
        fetchEvents
    }
)(Requests);
