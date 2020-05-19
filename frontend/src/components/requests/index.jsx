import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING, STATUS_FAILED, STATUS_SUCCESS } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import {
    fetchRequests,
    toggleRequest,
    toggleAllRequests,
    fetchSingleRequest,
    clearRequestSelection,
    fetchEvents,
    triggerSubmitEvent,
    confirmSubmitEvent,
    cancelSubmitEvent
} from '../../redux/actions';
import Loading from '../common/loading';
import Error from '../common/error';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';
import RequestSelection from './selection';
import RequestsEventDialog from './event-dialog';


class Requests extends React.Component {
    
    constructor(props) {
        super(props);
        this.fetchRequests = this.fetchRequests.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.submitAction = this.submitAction.bind(this);
        this.confirmEventSubmission = this.confirmEventSubmission.bind(this);
        this.cancelEventSubmission = this.cancelEventSubmission.bind(this);
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

    toggleRequest(id) {
        this.props.toggleRequest(id);
    }

    toggleAllRequests() {
        this.props.toggleAllRequests();
    }

    selectRequest(id) {
        this.props.fetchSingleRequest(id);
    }

    clearSelection() {
        this.props.clearRequestSelection();
    }

    // Rename?
    submitAction(event) {
        this.props.triggerSubmitEvent(event, this.getSelectedIds());
    }

    confirmEventSubmission(event, data) {
        this.props.confirmSubmitEvent(event, this.getSelectedIds(), data);
    }

    cancelEventSubmission() {
        this.props.cancelSubmitEvent();
    }

    getSelectedIds() {
        return this.props.items
            .filter(item => item.checked)
            .map(item => item.data.id);
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
                <RequestsList
                    requests={ this.props.items }
                    onSelect={ id => this.selectRequest(id) }
                    onToggle={ id => this.toggleRequest(id) }
                    onToggleAll={ () => this.toggleAllRequests() } />
                <RequestsActions
                    disabled={ !this.getSelectedIds().length }
                    status={ this.props.events.loadingStatus }
                    events={ this.props.events.items }
                    onAction={ action => this.submitAction(action) } />
            </div>
        );
    }

    getRequestSelection() {
        return <RequestSelection
            status={ this.props.selection.status }
            item={ this.props.selection.item }
            onClose={ () => this.clearSelection() } />
    }

    getEventDialog() {
        return <RequestsEventDialog
            details={ this.props.events.dialog }
            onConfirm={ this.confirmEventSubmission }
            onCancel={ this.cancelEventSubmission } />;
    }

    render() {

        // TODO refresh button?

        const contents = this.getContents();

        const selection = this.getRequestSelection();

        const eventDialog = this.getEventDialog();

        return (
            <div className="requests-container">
                { contents }
                { selection }
                { eventDialog }
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
        toggleRequest,
        toggleAllRequests,
        fetchSingleRequest,
        clearRequestSelection,
        fetchEvents,
        triggerSubmitEvent,
        confirmSubmitEvent,
        cancelSubmitEvent
    }
)(Requests);
