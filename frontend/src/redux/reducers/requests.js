
const initialState = {
    filter: '',
    requestStatus: 'idle',
    items: []
    // TODO userAction?
};

export default function(state = initialState, action) {
    switch (action.type) {
        // TODO action handling
        default:
            return state;
    }
}
