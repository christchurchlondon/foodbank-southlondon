import {
    SET_TAB,
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED,
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED
} from './types';
import {
    getRequests,
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

export const fetchRequests = filter => {
    return dispatch => {
        dispatch(loadRequests(filter));
        return getRequests(filter)
            .then(response => dispatch(requestsLoaded(response)))
            .catch(() => dispatch(loadRequestsFailed()));
    };
}

export const loadRequests = filter => ({
    type: LOAD_REQUESTS,
    payload: {
        filter
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

// Lists

export const fetchLists = () => {
    return dispatch => {
        dispatch(loadLists());
        return getLists()
            .then(response => dispatch(listsLoaded(response)))
            .catch(() => loadListsFailed())
    }
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
