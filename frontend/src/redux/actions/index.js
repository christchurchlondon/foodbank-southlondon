import {
    SET_TAB,
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED,
    SELECT_REQUEST,
    REQUEST_SELECTION_LOADED,
    CLEAR_REQUEST_SELECTION,
    SELECT_REQUEST_FAILED,
    TOGGLE_REQUEST,
    TOGGLE_ALL_REQUESTS,
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED,
    TOGGLE_LIST_SELECTION,
    CLEAR_LIST_SELECTION,
    LOAD_EVENTS,
    EVENTS_LOADED,
    LOAD_EVENTS_FAILED,
    OPEN_SUBMIT_DIALOG,
    CLOSE_SUBMIT_DIALOG,
    SUBMIT_EVENT,
    EVENT_SUBMIT_COMPLETE,
    EVENT_SUBMIT_FAILED
} from './types';
import {
    getRequests,
    getSingleRequest,
    getLists,
    getEvents,
    postEvent
} from '../../service';


// Tabs

export const setTab = tab => ({
    type: SET_TAB,
    payload: {
        tab
    }
});


// Requests

export const fetchRequests = filters => {
    return dispatch => {
        dispatch(loadRequests(filters));
        return getRequests(filters)
            .then(result => dispatch(requestsLoaded(result)))
            .catch(() => dispatch(loadRequestsFailed()));
    };
};

export const loadRequests = filters => ({
    type: LOAD_REQUESTS,
    payload: {
        filters
    }
});

export const requestsLoaded = requests => ({
    type: REQUESTS_LOADED,
    payload: {
        requests
    }
});

export const loadRequestsFailed = () => ({
    type: LOAD_REQUESTS_FAILED
});

export const fetchSingleRequest = id => {
    return dispatch => {
        dispatch(selectRequest(id));
        return getSingleRequest(id)
            .then(result => dispatch(requestSelectionLoaded(result)))
            .catch(() => selectRequestFailed());
    };
};

export const selectRequest = id => ({
    type: SELECT_REQUEST,
    payload: {
        id
    }
});

export const requestSelectionLoaded = request => ({
    type: REQUEST_SELECTION_LOADED,
    payload: {
        request
    }
});

export const clearRequestSelection = () => ({
    type: CLEAR_REQUEST_SELECTION
});

export const selectRequestFailed = () => ({
    type: SELECT_REQUEST_FAILED
});

export const toggleRequest = id => ({
    type: TOGGLE_REQUEST,
    payload: {
        id
    }
});

export const toggleAllRequests = () => ({
    type: TOGGLE_ALL_REQUESTS
});

// Lists

export const fetchLists = () => {
    return dispatch => {
        dispatch(loadLists());
        return getLists()
            .then(result => dispatch(listsLoaded(result)))
            .catch(() => loadListsFailed())
    };
}

export const loadLists = () => ({
    type: LOAD_LISTS
});

export const listsLoaded = lists => ({
    type: LISTS_LOADED,
    payload: {
        lists
    }
});

export const loadListsFailed = () => ({
    type: LOAD_LISTS_FAILED
});

export const toggleListSelection = (id, type) => ({
    type: TOGGLE_LIST_SELECTION,
    payload: {
        id,
        type
    }
});

export const clearListSelection = () => ({
    type: CLEAR_LIST_SELECTION
})

// Events

export const fetchEvents = () => {
    return dispatch => {
        dispatch(loadEvents())
        return getEvents()
            .then(result => dispatch(eventsLoaded(result)))
            .catch(() => loadEventsFailed());
    };
};

export const loadEvents = () => ({
    type: LOAD_EVENTS
});

export const eventsLoaded = events => ({
    type: EVENTS_LOADED,
    payload: {
        events
    }
});

export const loadEventsFailed = message => ({
    type: LOAD_EVENTS_FAILED,
    payload: {
        message
    }
});

export const triggerSubmitEvent = (event, ids) => {
    return dispatch => {
        if (event.requiresConfirmation) {
            dispatch(openSubmitDialog(event, ids));
        } else {
            dispatch(sendEvent(event, ids));
        }
    };
};

export const openSubmitDialog = event => ({
    type: OPEN_SUBMIT_DIALOG,
    payload: {
        event
    }
});

export const confirmSubmitEvent = (event, ids, data) => {
    return dispatch => {
        dispatch(sendEvent(event, ids, data));
        dispatch(closeSubmitDialog());
    };
};

export const cancelSubmitEvent = () => {
    return dispatch => {
        dispatch(closeSubmitDialog());
    };
};

export const closeSubmitDialog = () => ({
    type: CLOSE_SUBMIT_DIALOG
});

export const sendEvent = (event, ids, data) => {
    return dispatch => {
        dispatch(submitEvent(event));
        return submitEvent(event, ids, data)
            .then(() => eventSubmitComplete())
            .catch(() => eventSubmitFailed());
    };
};

export const submitEvent = event => ({
    type: SUBMIT_EVENT
});

export const eventSubmitComplete = () => ({
    type: EVENT_SUBMIT_COMPLETE
});

export const eventSubmitFailed = () => ({
    type: EVENT_SUBMIT_FAILED
});
