import {
    SET_TAB
} from './types';

export const setTab = tab => ({
    type: SET_TAB,
    payload: {
        tab
    }
});
