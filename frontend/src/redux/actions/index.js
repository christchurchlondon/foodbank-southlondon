import {
    SET_TAB,
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED,
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED
} from './types';

export const setTab = tab => ({
    type: SET_TAB,
    payload: {
        tab
    }
});

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

export const LOAD_REQUESTS_FAILED = message => ({
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
