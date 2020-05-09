import {
    SET_TAB,
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED,
    SELECT_REQUEST,
    REQUEST_SELECTION_LOADED,
    CLEAR_REQUEST_SELECTION,
    SELECT_REQUEST_FAILED,
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED
} from './types';
import {
    getRequests,
    getSingleRequest,
    getLists
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
            .then(response => dispatch(requestsLoaded(response)))
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
            .then(response => dispatch(requestSelectionLoaded(response)))
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


// Lists

export const fetchLists = () => {
    return dispatch => {
        dispatch(loadLists());
        return getLists()
            .then(response => dispatch(listsLoaded(response)))
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
