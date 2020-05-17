import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import {
    LOAD_LISTS,
    LISTS_LOADED,
    LOAD_LISTS_FAILED,
    TOGGLE_LIST_SELECTION,
    CLEAR_LIST_SELECTION
} from '../actions/types';



const initialState = {
    status: STATUS_IDLE,
    items: [],
    selectedComment: null
}

export default function(state = initialState, action) {
    switch (action.type) {

        case LOAD_LISTS:
            return {
                ...state,
                status: STATUS_LOADING,
                items: [],
                selectedComment: null
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
        case TOGGLE_LIST_SELECTION:
            const { id, type } = state.selectedComment || { id: null, type: null };
            const selectedComment = (id === action.payload.id && type === action.payload.type)
                ? null
                : { id: action.payload.id, type: action.payload.type };
            return {
                ...state,
                selectedComment
            };
        case CLEAR_LIST_SELECTION:
            return {
                ...state,
                selectedComment: null
            };

        default:
            return state;
    }
}
