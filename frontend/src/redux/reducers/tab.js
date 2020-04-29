import { SET_TAB } from '../actions/types';


const initialState = {
    tab: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TAB:
            return {
                ...state,
                tab: action.payload.tab
            };
        default:
            return state;
    }
}
