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
        .then(() => (new Array(25)).fill(null).map(_ => makeRequest()));
        // .then(() => [1,2,3,4,5].map(_ => makeRequest()));
}



// API endpoint faking

async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
}

function makeRequest() {
    const id = Math.floor(Math.random() * 1000);
    return {
        id,
        name: `Request ${id}`,
        referenceNumber: Math.floor(Math.random() * 5e5),
        type: '[ type ]'
        // More values?
    };
}
