
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
    LOAD_TIME_OF_DAY_FILTER_VALUES,
    TIME_OF_DAY_FILTER_VALUES_LOADED,
    LOAD_TIME_OF_DAY_FILTER_VALUES_FAILED
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
    paging: {
        page: 0,
        totalPages: 0,
        totalItems: 0,
        pageSize: 0
    },
    selection: {
        id: null,
        status: STATUS_IDLE,
        item: null
    },
    statuses: {
        loadingStatus: STATUS_IDLE,
        items: []
    },
    actions: {
        loadingStatus: STATUS_IDLE,
        items: []
    },
    events: {
        dialog: null,
        updateStatus: STATUS_IDLE
    },
    timeOfDayFilterValues: {
        loadingStatus: STATUS_IDLE,
        items: []
    },
    editUrl: ''
};

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_REQUESTS:
            return {
                ...state,
                filters: action.payload.filters,
                status: STATUS_LOADING,
                paging: {
                    ...state.paging,
                    page: action.payload.page,
                    totalPages: 0,
                    totalItems: 0,
                    pageSize: 0
                },
                items: []
            };
        case REQUESTS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
                paging: {
                    ...state.paging,
                    page: action.payload.paging.page,
                    totalPages: action.payload.paging.totalPages,
                    totalItems: action.payload.paging.totalItems,
                    pageSize: action.payload.paging.pageSize
                },
                items: action.payload.requests
                    .map(request => ({
                        data: request,
                        checked: false
                    })),
                editUrl: action.payload.editUrl
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


        case LOAD_STATUSES:
            return {
                ...state,
                statuses: {
                    ...state.statuses,
                    loadingStatus: STATUS_LOADING,
                    items: []
                }
            };
        case STATUSES_LOADED:
            return {
                ...state,
                statuses: {
                    ...state.statuses,
                    loadingStatus: STATUS_SUCCESS,
                    items: action.payload.statuses
                }
            };
        case LOAD_STATUSES_FAILED:
            return {
                ...state,
                statuses: {
                    ...state.statuses,
                    loadingStatus: STATUS_FAILED,
                    items: []
                }
            };

        case LOAD_ACTIONS:
            return {
                ...state,
                actions: {
                    ...state.actions,
                    loadingStatus: STATUS_LOADING,
                    items: []
                }
            };
        case ACTIONS_LOADED:
            return {
                ...state,
                actions: {
                    ...state.statuses,
                    loadingStatus: STATUS_SUCCESS,
                    items: action.payload.actions
                }
            };
        case LOAD_ACTIONS_FAILED:
            return {
                ...state,
                actions: {
                    ...state.actions,
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
                        event: action.payload.event,
                        type: action.payload.type
                    }
                }
            };
        case CLOSE_SUBMIT_DIALOG:
            return {
                ...state,
                events: {
                    ...state.events,
                    updateStatus: STATUS_IDLE,
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
        case LOAD_TIME_OF_DAY_FILTER_VALUES:
            return {
                ...state,
                timeOfDayFilterValues: {
                    loadingStatus: STATUS_LOADING,
                    items: []
                }
            }

        case TIME_OF_DAY_FILTER_VALUES_LOADED:
            return {
                ...state,
                timeOfDayFilterValues: {
                    loadingStatus: STATUS_SUCCESS,
                    items: action.payload.values
                }
            };
        case LOAD_TIME_OF_DAY_FILTER_VALUES_FAILED:
            return {
                ...state,
                timeOfDayFilterValues: {
                    loadingStatus: STATUS_FAILED,
                    items: []
                }
            };

        default:
            return state;
    }
}
