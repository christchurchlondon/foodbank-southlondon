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
    getRequests
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
        dispatch(loadRequests());
        return fetch(filter)
            .then(response => dispatch(requestsLoaded(['request 1', 'request 2', 'request 3'])));
    };
}

export const loadRequests = () => ({
    type: LOAD_REQUESTS
});

export const requestsLoaded = requests => ({
    type: REQUESTS_LOADED,
    payload: {
        requests
    }
});

export const loadRequestsFailed = message => ({
    type: LOAD_REQUESTS_FAILED,
    payload: {
        message
    }
});

export const loadLists = () => ({
    type: LOAD_LISTS
});

export const listsLoaded = lists => ({
    type: LISTS_LOADED,
    payload: {
        lists
    }
});

export const loadListsFailed = message => ({
    type: LOAD_LISTS_FAILED,
    payload: {
        message
    }
});
