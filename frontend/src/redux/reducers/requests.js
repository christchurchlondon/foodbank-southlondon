import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
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
    LOAD_EVENTS_FAILED
} from '../actions/types';


const initialState = {
    filter: '',
    status: STATUS_IDLE,
    items: [],
    selection: {
        status: STATUS_IDLE,
        item: null
    },
    events: {
        status: STATUS_IDLE,
        items: []
    }
};

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_REQUESTS:
            return {
                ...state,
                filters: action.payload.filters,
                status: STATUS_LOADING,
                items: []
            };
        case REQUESTS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
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
                    status: STATUS_LOADING,
                    item: null
                }
            };
        case REQUEST_SELECTION_LOADED:
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
                    status: STATUS_IDLE
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
                    status: STATUS_LOADING,
                    items: []
                }
            };
        case EVENTS_LOADED:
            return {
                ...state,
                events: {
                    ...state.events,
                    status: STATUS_SUCCESS,
                    items: action.payload.events
                }
            };
        case LOAD_EVENTS_FAILED:
            return {
                ...state,
                events: {
                    ...state.events,
                    status: STATUS_FAILED,
                    items: []
                }
            };

        default:
            return state;
    }
}
