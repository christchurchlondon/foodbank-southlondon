import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import { CALENDARS_LOADED, LOAD_CALENDARS, LOAD_CALENDARS_FAILED } from "../actions/types";

const initialState = {
    status: STATUS_IDLE,
    calendars: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOAD_CALENDARS:
            return { ...state, status: STATUS_LOADING };

        case CALENDARS_LOADED:
            return {
                ...state,
                status: STATUS_SUCCESS,
                calendars: action.payload.calendars
            };

        case LOAD_CALENDARS_FAILED:
            return {
                ...state,
                status: STATUS_FAILED
            };

        default:
            return state;
    }
}