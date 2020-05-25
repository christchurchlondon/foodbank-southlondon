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
    OPEN_ITEM_ADD_FORM,
    OPEN_ITEM_EDIT_FORM,
    DELETE_LIST_ITEM,
    CONFIRM_LIST_ITEM_EDIT,
    CANCEL_LIST_ITEM_EDIT,
    OPEN_SAVE_LIST_DIALOG,
    CLOSE_SAVE_LIST_DIALOG,
    UPDATE_LIST,
    UPDATE_LIST_COMPLETE,
    UPDATE_LIST_FAILED,
    MOVE_LIST_ITEM,
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
    postEvent,
    postListUpdate
} from '../../service';


// Tabs

export const setTab = tab => ({
    type: SET_TAB,
    payload: {
        tab
    }
});


// Requests

export const fetchRequests = (filters, page) => {
    return dispatch => {
        dispatch(loadRequests(filters, page));
        return getRequests(filters, page)
            .then(({result, page, totalPages}) => dispatch(requestsLoaded(result, page, totalPages)))
            .catch(() => dispatch(loadRequestsFailed()));
    };
};

export const loadRequests = (filters, page) => ({
    type: LOAD_REQUESTS,
    payload: {
        filters,
        page
    }
});

export const requestsLoaded = (requests, page, totalPages) => ({
    type: REQUESTS_LOADED,
    payload: {
        requests,
        page,
        totalPages
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
            .then(({ lists, notes }) => dispatch(listsLoaded(lists, notes)))
            .catch(() => dispatch(loadListsFailed()))
    };
}

export const loadLists = () => ({
    type: LOAD_LISTS
});

export const listsLoaded = (lists, notes) => ({
    type: LISTS_LOADED,
    payload: {
        lists,
        notes
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

export const openItemAddForm = () => ({
    type: OPEN_ITEM_ADD_FORM
});

export const openItemEditForm = (id, data) => ({
    type: OPEN_ITEM_EDIT_FORM,
    payload: {
        id,
        data
    }
});

export const deleteListItem = id => ({
    type: DELETE_LIST_ITEM,
    payload: {
        id
    }
});

export const confirmListItemEdit = (id, item) => ({
    type: CONFIRM_LIST_ITEM_EDIT,
    payload: {
        id,
        item
    }
});

export const cancelListItemEdit = () => ({
    type: CANCEL_LIST_ITEM_EDIT
});

export const openSaveListDialog = () => ({
    type: OPEN_SAVE_LIST_DIALOG
});

export const closeSaveListDialog = () => ({
    type: CLOSE_SAVE_LIST_DIALOG
});

export const sendListUpdate = (data, notes) => {
    return dispatch => {
        dispatch(updateList(data));
        return postListUpdate(data, notes)
            .then(() => {
                dispatch(updateListComplete());
                dispatch(closeSaveListDialog());
            })
            .catch(() => dispatch(updateListFailed()));
    };
};

export const updateList = data => ({
    type: UPDATE_LIST,
    payload: {
        data
    }
});

export const updateListComplete = () => ({
    type: UPDATE_LIST_COMPLETE
});

export const updateListFailed = () => ({
    type: UPDATE_LIST_FAILED
});

export const moveListItem = (oldPosition, newPosition) => ({
    type: MOVE_LIST_ITEM,
    payload: {
        oldPosition,
        newPosition
    }
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
        return postEvent(event, ids, data)
            .then(() => dispatch(eventSubmitComplete()))
            .catch(() => dispatch(eventSubmitFailed()));
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
