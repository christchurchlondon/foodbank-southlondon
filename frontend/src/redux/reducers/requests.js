import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import { today } from '../../helpers';
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
    LOAD_EVENTS,
    EVENTS_LOADED,
    LOAD_EVENTS_FAILED,
    OPEN_SUBMIT_DIALOG,
    CLOSE_SUBMIT_DIALOG,
    SUBMIT_EVENT,
    EVENT_SUBMIT_COMPLETE,
    EVENT_SUBMIT_FAILED
} from '../actions/types';


const initialState = {
    filters: {
        dates: {
            start: today(),
            end: today()
        }
    },
    status: STATUS_IDLE,
    items: [],
    page: 0,
    totalPages: 0,
    selection: {
        id: null,
        status: STATUS_IDLE,
        item: null
    },
    events: {
        loadingStatus: STATUS_IDLE,
        items: [],
        dialog: null,
        updateStatus: STATUS_IDLE
    }
};

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_REQUESTS:
            return {
                ...state,
                filters: action.payload.filters,
                status: STATUS_LOADING,
                page: action.payload.page,
                items: []
            };
        case REQUESTS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
                page: action.payload.page,
                totalPages: action.payload.totalPages,
                items: action.payload.requests
                    .map(request => ({
                        data: request,
                        checked: false
                    }))
            };
        case LOAD_REQUESTS_FAILED:
            return {
                ...state,
                status: STATUS_FAILED
            };
        case SELECT_REQUEST:
            return {
                ...state,
                selection: {
                    ...state.selection,
                    id: action.payload.id,
                    status: STATUS_LOADING,
                    item: null
                }
            };
        case REQUEST_SELECTION_LOADED:
            if (action.payload.id !== state.selection.id) return state;
            return {
                ...state,
                selection: {
                    ...state.selection,
                    status: STATUS_SUCCESS,
                    item: action.payload.request
                }
            };
        case SELECT_REQUEST_FAILED:
            return {
                ...state,
                selection: {
                    ...state.selection,
                    status: STATUS_FAILED,
                    item: null
                }
            };
        case CLEAR_REQUEST_SELECTION:
            return {
                ...state,
                selection: {
                    ...state.selection,
                    id: null,
                    status: STATUS_IDLE,
                    item: null
                }
            };
        case TOGGLE_REQUEST:
            return {
                ...state,
                items: state.items
                    .map(item => {
                        return (item.data.id === action.payload.id)
                            ? { ...item, checked: !item.checked }
                            : item;
                    })
            };
        case TOGGLE_ALL_REQUESTS:
            const checked = state.items.some(i => !i.checked);
            return {
                ...state,
                items: state.items.map(item => ({
                    ...item,
                    checked
                }))
            };
        case LOAD_EVENTS:
            return {
                ...state,
                events: {
                    ...state.events,
                    loadingStatus: STATUS_LOADING,
                    items: []
                }
            };
        case EVENTS_LOADED:
            return {
                ...state,
                events: {
                    ...state.events,
                    loadingStatus: STATUS_SUCCESS,
                    items: action.payload.events
                }
            };
        case LOAD_EVENTS_FAILED:
            return {
                ...state,
                events: {
                    ...state.events,
                    loadingStatus: STATUS_FAILED,
                    items: []
                }
            };
        case OPEN_SUBMIT_DIALOG:
            return {
                ...state,
                events: {
                    ...state.events,
                    dialog: {
                        event: action.payload.event
                    }
                }
            };
        case CLOSE_SUBMIT_DIALOG:
            return {
                ...state,
                events: {
                    ...state.events,
                    dialog: null
                }
            };
        case SUBMIT_EVENT:
            return {
                ...state,
                events: {
                    ...state.events,
                    updateStatus: STATUS_LOADING
                }
            };
        case EVENT_SUBMIT_COMPLETE:
            return {
                ...state,
                events: {
                    ...state.events,
                    updateStatus: STATUS_SUCCESS
                }
            };
        case EVENT_SUBMIT_FAILED:
            return {
                ...state,
                events: {
                    ...state.events,
                    updateStatus: STATUS_FAILED
                }
            };

        default:
            return state;
    }
}
