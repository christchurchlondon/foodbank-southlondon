import {
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
    LOAD_STATUSES,
    STATUSES_LOADED,
    LOAD_STATUSES_FAILED,
    LOAD_ACTIONS,
    ACTIONS_LOADED,
    LOAD_ACTIONS_FAILED,
    OPEN_SUBMIT_DIALOG,
    CLOSE_SUBMIT_DIALOG,
    SUBMIT_EVENT,
    EVENT_SUBMIT_COMPLETE,
    EVENT_SUBMIT_FAILED,
    LOAD_FILTER_VALUES,
    LOAD_FILTER_VALUES_FAILED,
    FILTER_VALUES_LOADED,
    LOAD_CALENDARS,
    CALENDARS_LOADED,
    LOAD_CALENDARS_FAILED
} from './types';
import {
    getRequests,
    getSingleRequest,
    getLists,
    getStatuses,
    getActions,
    postEvent,
    postListUpdate,
    getFilterValues,
    getCalendars
} from '../../service';



// Requests

export const fetchRequests = (filters, page, refreshCache, clearItems) => {
    return dispatch => {
        dispatch(loadRequests(filters, page, clearItems));
        return getRequests(filters, page, refreshCache)
            .then(({ result, paging, editUrl }) => dispatch(requestsLoaded(result, paging, editUrl)))
            .catch(() => dispatch(loadRequestsFailed()));
    };
};

export const loadRequests = (filters, page, clearItems) => ({
    type: LOAD_REQUESTS,
    payload: {
        filters,
        page,
        clearItems
    }
});

export const requestsLoaded = (requests, paging, editUrl) => ({
    type: REQUESTS_LOADED,
    payload: {
        requests,
        paging, editUrl
    }
});

export const loadRequestsFailed = () => ({
    type: LOAD_REQUESTS_FAILED
});

export const fetchSingleRequest = id => {
    return dispatch => {
        dispatch(selectRequest(id));
        return getSingleRequest(id)
            .then(result => dispatch(requestSelectionLoaded(id, result)))
            .catch(() => dispatch(selectRequestFailed()));
    };
};

export const selectRequest = id => ({
    type: SELECT_REQUEST,
    payload: {
        id
    }
});

export const requestSelectionLoaded = (id, request) => ({
    type: REQUEST_SELECTION_LOADED,
    payload: {
        id,
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


// Statuses

export const fetchStatuses = () => {
    return dispatch => {
        dispatch(loadStatuses())
        return getStatuses()
            .then(result => dispatch(statusesLoaded(result)))
            .catch(loadStatusesFailed);
    };
};

export const loadStatuses = () => ({
    type: LOAD_STATUSES
});

export const statusesLoaded = statuses => ({
    type: STATUSES_LOADED,
    payload: {
        statuses
    }
});

export const loadStatusesFailed = message => ({
    type: LOAD_STATUSES_FAILED,
    payload: {
        message
    }
});

// TODO more actions


// Actions

export const fetchActions = () => {
    return dispatch => {
        dispatch(loadActions())
        return getActions()
            .then(result => dispatch(actionsLoaded(result)))
            .catch(loadActionsFailed);
    };
};

export const loadActions = () => ({
    type: LOAD_ACTIONS
});

export const actionsLoaded = actions => ({
    type: ACTIONS_LOADED,
    payload: {
        actions
    }
});

export const loadActionsFailed = message => ({
    type: LOAD_ACTIONS_FAILED,
    payload: {
        message
    }
});

// TODO more?

export const fetchFilterValues = (attribute) => {
    return dispatch => {
        dispatch({
            type: LOAD_FILTER_VALUES,
            payload: {
                attribute
            }
        });
        
        getFilterValues(attribute)
            .then(values => dispatch({
                type: FILTER_VALUES_LOADED,
                payload: {
                    attribute,
                    values
                }
            }))
            .catch(message => dispatch({
                type: LOAD_FILTER_VALUES_FAILED,
                payload: {
                    attribute,
                    message
                }
            }));
    }
}

// Events

export const triggerSubmitEvent = (event, type, ids, filters, page) => {
    return dispatch => {
        if (event.requiresConfirmation) {
            dispatch(openSubmitDialog(event, type));
        } else {
            dispatch(sendEvent(event, type, ids, {}, filters, page));
        }
    };
};

export const openSubmitDialog = (event, type, message, ignoreWarnings) => ({
    type: OPEN_SUBMIT_DIALOG,
    payload: {
        event,
        type,
        message,
        ignoreWarnings
    }
});

export const confirmSubmitEvent = (event, type, ids, data, filters = {}, page = 1, ignoreWarnings) => {
    return dispatch => {
        dispatch(sendEvent(event, type, ids, data, filters, page, ignoreWarnings));
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

export const sendEvent = (event, type, ids, data, filters, page, ignoreWarnings) => {
    return dispatch => {
        dispatch(submitEvent(event));
        return postEvent(event, ids, type, data, ignoreWarnings)
            .then(() => {
                dispatch(eventSubmitComplete());
                dispatch(closeSubmitDialog())
                dispatch(fetchRequests(filters, page));
            })
            .catch((err) => {
                if(err.warning) {
                    dispatch(openSubmitDialog(event, type, err.warning, true));
                } else {
                    dispatch(eventSubmitFailed());
                }
            });
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

// Calendars

export const fetchCalendars = () => {
    return dispatch => {
        dispatch({ type: LOAD_CALENDARS })
        getCalendars().then(({ calendars }) => {
            dispatch({
                type: CALENDARS_LOADED,
                payload: {
                    calendars
                }
            });
        }).catch(() => {
            dispatch({ type: LOAD_CALENDARS_FAILED });
        })
    };
}