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
    SELECT_REQUEST_FAILED
} from '../actions/types';


const initialState = {
    filter: '',
    status: STATUS_IDLE,
    items: [],
    selection: {
        status: STATUS_IDLE,
        item: null
    }
    // TODO userAction?
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

        default:
            return state;
    }
}
