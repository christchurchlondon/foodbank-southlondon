import {
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED
} from '../actions/types';


const initialState = {
    filter: '',
    status: 'idle',    // idle / loading / success / failed
    items: []
    // TODO userAction?
};

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_REQUESTS:
            return {
                ...state,
                status: 'loading',
                items: []
            };
        case REQUESTS_LOADED:
            return {
                ...state,
                status: 'success',
                items: action.payload.requests
            };
        case LOAD_REQUESTS_FAILED:
            return {
                ...state,
                status: 'failed'
            };

        default:
            return state;
    }
}
