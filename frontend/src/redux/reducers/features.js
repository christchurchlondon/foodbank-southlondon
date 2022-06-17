import { SET_FEATURE_ENABLED } from "../actions/types";

const LOCAL_STORAGE_KEY = 'foodbank-southlondon-features';

const initialStateJson = localStorage[LOCAL_STORAGE_KEY];
const initialState = initialStateJson ? JSON.parse(initialStateJson) : {};

export default function features(state = initialState, action) {
    switch(action.type) {
        case SET_FEATURE_ENABLED: {
            const { name, enabled } = action.payload;
            const newState = {
                ...state,
                [name]: enabled
            };

            localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(newState);
            return newState;
        }

        default:
            return state;
    }
} 