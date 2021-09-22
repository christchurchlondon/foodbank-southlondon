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
    DELETE_LIST_ITEM,
    CONFIRM_LIST_ITEM_EDIT,
    CANCEL_LIST_ITEM_EDIT,
    OPEN_SAVE_LIST_DIALOG,
    CLOSE_SAVE_LIST_DIALOG,
    UPDATE_LIST,
    UPDATE_LIST_COMPLETE,
    UPDATE_LIST_FAILED,
    MOVE_LIST_ITEM
} from '../actions/types';



const initialState = {
    status: STATUS_IDLE,
    items: [],
    notes: '',
    selectedComment: null,
    editItem: null,
    saveDialog: null,
    unsaved: false
};

export default function lists(state = initialState, action) {
    switch (action.type) {

        case LOAD_LISTS:
            return {
                ...state,
                status: STATUS_LOADING,
                items: [],
                selectedComment: null,
                unsaved: false
            };
        case LISTS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
                items: action.payload.lists,
                notes: action.payload.notes
            };
        case LOAD_LISTS_FAILED:
            return {
                ...state,
                status: STATUS_FAILED,
                items: [],
                notes: ''
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
            const newId = Math.max(...state.items.map(i => i.id)) + 1;
            return {
                ...state,
                editItem: {
                    id: newId,
                    data: createBlankItem(newId),
                    new: true
                }
            };
        case OPEN_ITEM_EDIT_FORM:
            const item = state.items.find(i => i.id === action.payload.id);
            if (!item) return state;
            return {
                ...state,
                editItem: {
                    id: action.payload.id,
                    data: { ...item }
                }
            };
        case DELETE_LIST_ITEM:
            return {
                ...state,
                items: state.items.filter(item => {
                    return item.id !== action.payload.id
                }),
                unsaved: true
            };
        case CONFIRM_LIST_ITEM_EDIT:
            const items = state.items.map(i => i.id).includes(action.payload.id)
                ? state.items.map(item => {
                    return item.id === action.payload.id
                        ? action.payload.item
                        : item;
                })
                :[ ...state.items, action.payload.item ];
            return {
                ...state,
                items,
                editItem: null,
                unsaved: true
            };
        case CANCEL_LIST_ITEM_EDIT:
            return {
                ...state,
                editItem: null
            }
        case OPEN_SAVE_LIST_DIALOG:
            return {
                ...state,
                saveDialog: {
                    status: STATUS_IDLE
                }
            };
        case CLOSE_SAVE_LIST_DIALOG:
            return {
                ...state,
                saveDialog: null
            }
        case UPDATE_LIST:
            return {
                ...state,
                saveDialog: {
                    ...state.saveDialog,
                    status: STATUS_LOADING
                }
            };
        case UPDATE_LIST_COMPLETE:
            return {
                ...state,
                saveDialog: {
                    ...state.saveDialog,
                    status: STATUS_SUCCESS
                },
                unsaved: false
            };
        case UPDATE_LIST_FAILED:
            return {
                ...state,
                saveDialog: {
                    ...state.saveDialog,
                    status: STATUS_FAILED
                }
            };
        case MOVE_LIST_ITEM:
            return {
                ...state,
                items: reorder(state.items, action.payload.oldPosition, action.payload.newPosition),
                unsaved: true
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

function createBlankItem(id) {
    return {
        id: id,
        description: '',
        householdSizes: {
            familyOf1: {
                quantity: '',
                notes: ''
            },
            familyOf2: {
                quantity: '',
                notes: ''
            },
            familyOf3: {
                quantity: '',
                notes: ''
            },
            familyOf4: {
                quantity: '',
                notes: ''
            },
            familyOf5: {
                quantity: '',
                notes: ''
            },
            familyOf6: {
                quantity: '',
                notes: ''
            },
            familyOf7: {
                quantity: '',
                notes: ''
            },
            familyOf8: {
                quantity: '',
                notes: ''
            },
            familyOf9: {
                quantity: '',
                notes: ''
            },
            familyOf10Plus: {
                quantity: '',
                notes: ''
            }
        }
    }
}
