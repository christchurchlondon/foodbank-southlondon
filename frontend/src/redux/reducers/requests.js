import {
    LOAD_REQUESTS,
    REQUESTS_LOADED,
    LOAD_REQUESTS_FAILED
} from '../actions/types';


const initialState = {
    filter: '',
    status: 'idle',    // idle / loading / success / errored
    items: []
    // TODO userAction?
};

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_REQUESTS:
        case REQUESTS_LOADED:
        case LOAD_REQUESTS_FAILED:

        default:
            return state;
    }
}
