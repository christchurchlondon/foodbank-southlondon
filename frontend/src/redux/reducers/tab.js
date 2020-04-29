import { SET_TAB } from '../actions/types';


const initialState = {
    currentTab: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TAB:
            return {
                ...state,
                currentTab: action.payload.tab
            };
    }
}
