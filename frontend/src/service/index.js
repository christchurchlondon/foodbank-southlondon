import fetch from 'cross-fetch';

const endpoints = {
    GET_REQUESTS: 'requests/',
    GET_SINGLE_REQUEST: 'bff/details',
    GET_LISTS: 'lists/'
};


function fetchFromServer(url, method = 'GET') {
    // TODO use method?
    // handle response
    return fetch('/api/' + url)
        .then(response => response.json());
}

export function getRequests(filters = {})  {

    // TODO convert payload to URL
    // {
    //     dates: { start, end },
    //     name,
    //     referenceNumber,
    //     postcode
    // }

    const url = endpoints.GET_REQUESTS; // TODO + `?filter=${filter}`;
    return fetchFromServer(url)
        .then(response => {

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
                    town: item.town,
                    county: item.county,
                    postcode: item.postcode
                },
                household: {
                    adults: item.number_of_adults,
                    children: item.number_of_children,
                    total: item.household_size,
                    ageOfChildren: item.age_of_children
                },
                requirements: {
                    dietary: item.dietary_requirements,
                    feminineProducts: item.feminine_products_required.toLowerCase() === 'true',
                    babyProducts: item.dietary_requirements.toLowerCase() === 'true',
                    petFood: item.dietary_requirements.toLowerCase() === 'true'
                },
                extraInformation: item.extra_information
            }));
        });
}

export function getSingleRequest(id) {
    return fetchFromServer(endpoints.GET_SINGLE_REQUEST + '/' + id)

    // TODO object property handling

}

export function getLists() {
    return fetchFromServer(endpoints.GET_LISTS)
        .then(response => {
            return response.items.map(item => {
                return {
                    description: item.item_description,
                    householdSizes: {
                        single: {
                            quantity: item.single_quantity,
                            notes: item.single_notes
                        },
                        familyOf2: {
                            quantity: item.family_of_2_quantity,
                            notes: item.family_of_2_notes
                        },
                        familyOf3: {
                            quantity: item.family_of_3_quantity,
                            notes: item.family_of_3_notes
                        },
                        familyOf4: {
                            quantity: item.family_of_4_quantity,
                            notes: item.family_of_4_notes
                        },
                        familyOf5Plus: {
                            quantity: item['family_of_5+_quantity'],
                            notes: item['family_of_5+_notes']
                        },
                    }
                }
            })
        });
}

