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
    CLEAR_LIST_SELECTION,
    OPEN_ITEM_ADD_FORM,
    OPEN_ITEM_EDIT_FORM,
    UPDATE_LIST,
    UPDATE_LIST_COMPLETE,
    UPDATE_LIST_FAILED,
    MOVE_LIST_ITEM
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
        case OPEN_ITEM_ADD_FORM:
        case OPEN_ITEM_EDIT_FORM:
        case UPDATE_LIST:
        case UPDATE_LIST_COMPLETE:
        case UPDATE_LIST_FAILED:
            // TODO
            return state;
        case MOVE_LIST_ITEM:
            return {
                ...state,
                items: reorder(state.items, action.payload.oldPosition, action.payload.newPosition)
            };

        default:
            return state;
    }
}

function reorder(list, oldIndex, newIndex) {
    const item = list[oldIndex];
    const newList = list.filter((_, i) => i !== oldIndex);
    newList.splice(newIndex, 0, item);
    return newList;
}

