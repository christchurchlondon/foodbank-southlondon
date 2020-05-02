import fetch from 'cross-fetch';

const endpoints = {
    GET_REQUESTS: '/api/requests',
    GET_LISTS: '/api/lists'
};


function fetchFromServer(url, method = 'GET') {
    // TODO use method?
    // handle response
    return fetch(url);
}

export function getRequests(filter = '') {
    const url = endpoints.GET_REQUESTS + `?filter=${filter}`;
    // return fetchFromServer(url);
    return stall(1200)
        .then(() => getMockRequests(filter));
}



// API endpoint faking

async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
}

function getMockRequests(filter = '') {
    const mockName = filter.trim().length > 0
        ? filter.substr(0, 20)
        : undefined;
    return (new Array(25)).fill(null).map(_ => makeRequest(mockName))
}

function makeRequest(name = 'Request') {
    const id = Math.floor(Math.random() * 100000);
    return {
        id,
        name: `${name} ${id}`,
        referenceNumber: Math.floor(Math.random() * 5e5),
        type: '[ type ]'
        // More values?
    };
}
