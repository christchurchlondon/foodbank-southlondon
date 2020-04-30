
// Header

export const getHeaderState = store => store.header;

export const getTab = store => {
    return getHeaderState(store).tab;
}


// Requests

export const getRequestsState = store => store.requests;

// Lists

export const getListsState = store => store.lists;
