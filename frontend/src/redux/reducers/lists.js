import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import {
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED
} from '../actions/types';



const initialState = {
    status: STATUS_IDLE,
    items: []
}

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_LISTS:
            return {
                ...state,
                status: STATUS_LOADING,
                items: []
            };
        case LISTS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
                items: action.payload.lists
            };
        case LOAD_LISTS_FAILED:
            return {
                ...state,
                status: STATUS_FAILED,
                items: []
            };

        default:
            return state;
    }
}
