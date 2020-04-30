
export const getHeaderState = store => store.header;

export const getTab = store => {
    return getHeaderState(store).tab;
}
