import fetch from 'cross-fetch';

const endpoints = {
    GET_REQUESTS: 'requests',
    GET_LISTS: 'lists'
};


function fetchFromServer(url, method = 'GET') {
    // TODO use method?
    // handle response

    const fullUrl = 'http://localhost:5000/api/' + url;

    return fetch(fullUrl)
        .then(response => response.json());
}

export function getRequests(filter = '') {
    const url = endpoints.GET_REQUESTS; // + `?filter=${filter}`;
    return fetchFromServer(url)
        .then(response => {

            console.log(response);

            // TODO add page info to response
            return response.items.map(item => ({
                id: item.request_id,
                referenceNumber: item.reference_number,
                fullName: item.client_full_name,
                phoneNumber: item.phone_number,
                delivery: {
                    date: item.delivery_date,
                    instructions: item.delivery_instructions
                },
                address: {
                    line1: item.address_line_1,
                    line2: item.address_line_2,
                }
            }));
        });

    // address: { line 1, line2, town, county, postcode },
    // household details { adults, children, total, age of children }
    // requirements { dietary, feminine, baby, pet food }
    // extra information

    // return stall(1200)
    //     .then(() => getMockRequests(filter));

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
