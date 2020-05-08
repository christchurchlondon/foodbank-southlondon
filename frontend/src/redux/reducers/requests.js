import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import {
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED
} from '../actions/types';


const initialState = {
    filter: '',
    status: STATUS_IDLE,
    items: []
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

        default:
            return state;
    }
}
