import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
    STATUS_FAILED,
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS
} from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import {
    fetchRequests,
    toggleRequest,
    toggleAllRequests,
    fetchSingleRequest,
    clearRequestSelection,
    fetchStatuses,
    fetchActions,
    triggerSubmitEvent,
    confirmSubmitEvent,
    cancelSubmitEvent
} from '../../redux/actions';
import Paginator from '../common/paginator';
import Loading from '../common/loading';
import Error from '../common/error';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';
import RequestSelection from './selection';
import RequestsEventDialog from './event-dialog';
import './styles/index.scss';


class Requests extends React.Component {
    
    constructor(props) {
        super(props);
        this.selectPage = this.selectPage.bind(this);
        this.fetchRequests = this.fetchRequests.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.triggerSubmit = this.triggerSubmit.bind(this);
        this.confirmEventSubmission = this.confirmEventSubmission.bind(this);
        this.cancelEventSubmission = this.cancelEventSubmission.bind(this);

        this.state = {
            filters: {}
        };
    }

    componentDidMount() {
        if (this.props.status === STATUS_IDLE) {
            this.fetchRequests(this.props.filters);
        }
        this.fetchEvents();
    }

    selectPage(page) {
        this.fetchRequests(this.state.filters, page);
    }

    fetchRequests(filters = {}, page = 1, refreshCache = false) {
        this.setState({ filters });
        this.props.fetchRequests(filters, page, refreshCache);
    }

    fetchEvents() {
        this.props.fetchStatuses();
        this.props.fetchActions();
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

    triggerSubmit(event, type) {
        this.props.triggerSubmitEvent(event, type, this.getSelectedIds(), this.state.filters, this.props.paging.page);
    }

    confirmEventSubmission(event, type, data) {
        this.props.confirmSubmitEvent(event, type, this.getSelectedIds(), data, this.state.filters, this.props.paging.page);
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

    getFilter() {
        return <RequestsFilter
            onSubmit={ v => this.fetchRequests(v) }
            value={ this.props.filters } />;
    }

    getActions() {
        return <RequestsActions
            recordCount={ this.getSelectedIds().length }
            statuses={ this.props.statuses }
            actions={ this.props.actions }
            onAction={ (action, type) => this.triggerSubmit(action, type) } />;
    }

    getContents() {
        if (this.isLoading()) return <Loading />;
        if (this.isFailed()) return <Error message={'Unable to load requests'} />;
        return this.getRequestsContents();
    }

    getRequestsContents() {
        return (
            <div>
                <RequestsList
                    requests={ this.props.items }
                    onSelect={ id => this.selectRequest(id) }
                    onToggle={ id => this.toggleRequest(id) }
                    onToggleAll={ () => this.toggleAllRequests() }
                    onRefresh={() => this.fetchRequests(this.props.filters, this.props.paging.page, true) } />
                <div className="requests-controls">
                    <Paginator
                        selectedPage={ this.props.paging.page }
                        pages={ this.props.paging.totalPages }
                        pageSize={ this.props.paging.pageSize }
                        totalRecords={ this.props.paging.totalItems }
                        onSelect={ this.selectPage } />
                    { this.getEditLink() }
                </div>
            </div>
        );
    }

    getEditLink() {
        return this.props.editUrl
            ? <a className="button add-button" href={ this.props.editUrl } title="Open Google sheet to edit"
                target="_blank" rel="noopener noreferrer">
                <Icon icon="plus" />New request
            </a>
            : null;
    }

    getRequestSelection() {
        return <RequestSelection
            status={ this.props.selection.status }
            item={ this.props.selection.item }
            onClose={ () => this.clearSelection() } />
    }

    getEventDialog() {
        return this.props.events.dialog
            && <RequestsEventDialog
                details={ this.props.events.dialog }
                status={ this.props.events.updateStatus }
                onConfirm={ this.confirmEventSubmission }
                onCancel={ this.cancelEventSubmission } />;
    }

    render() {

        const filter = this.getFilter();
        const actions = this.getActions();

        const contents = this.getContents();

        const selection = this.getRequestSelection();

        const eventDialog = this.getEventDialog();

        return (
            <div className="requests-container">
                <div className="requests-header">
                    { filter }
                    { actions }
                </div>
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
        fetchStatuses,
        fetchActions,
        triggerSubmitEvent,
        confirmSubmitEvent,
        cancelSubmitEvent
    }
)(Requests);
