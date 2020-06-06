import fetch from 'cross-fetch';
import { format, parse } from 'date-fns';
import { DATE_FORMAT_REQUEST, DATE_FORMAT_TIMESTAMP } from '../constants';

const endpoints = {
    GET_REQUESTS: 'bff/status',
    GET_SINGLE_REQUEST: 'bff/details/',
    GET_LISTS: 'api/lists/',
    GET_EVENTS: 'api/events/distinct/?attribute=event_name',
    SUBMIT_EVENT: 'bff/actions/',
    SUBMIT_LISTS: 'api/lists/'
};


function performFetch(url) {
    return fetch(url, { cache: 'no-cache' })
        .then(response => response.json());
}

function performPost(url, data = {}) {
    return fetch(url, {
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(response => response.json())
}

function performDownload(url, data = {}) {
    return fetch(url, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        });
}

function encodeParams(params) {
    return '?' + Object.entries(params)
        .map(param => param.map(_ => _ || '').map(encodeURIComponent).join('='))
        .join('&');
}

function formatDate(date) {
    return format(date, DATE_FORMAT_REQUEST);
}

function parseDate(text, format = DATE_FORMAT_REQUEST) {
    return parse(text, format, new Date())
}

function parseTimestamp(timestamp) {
    if (!timestamp) return null;
    return parse(timestamp.substr(0, 19).replace('T', ' '), DATE_FORMAT_TIMESTAMP, new Date());
}

export function getRequests(filters = {}, page = 1) {

    // TODO refactor following back end change
    let dates = [];
    (filters.dates || {}).start && dates.push(formatDate(filters.dates.start));
    (filters.dates || {}).end && dates.push(formatDate(filters.dates.end));

    const params = {
        page: page,
        perpage: 50,
        // delivery_dates: dates.join(','),
        client_full_names: filters.name,
        reference_numbers: filters.referenceNumber,
        postcodes: filters.postcode
    };

    const url = endpoints.GET_REQUESTS + encodeParams(params);
    return performFetch(url)
        .then(response => {

            const result = response.items.map(item => ({
                id: item.request_id,
                fullName: item.client_full_name,
                referenceNumber: item.reference_number,
                deliveryDate: parseDate(item.delivery_date, 'dd/MM/yyyy'),
                event: extractEvent(item),
                postcode: item.postcode
            }));

            return {
                result,
                page: response.page,
                totalPages: response.total_pages
            };
        });
}

export function getSingleRequest(id) {
    return performFetch(endpoints.GET_SINGLE_REQUEST + id)
        .then(response => {
            const details = responseItemToRequest(response.request);
            const events = response.events.map(event => ({
                name: event.event_name,
                data: event.event_data,
                timestamp: parseTimestamp(event.event_timestamp)
            }));
            return { details, events };
        });
    // TODO error if response.items is empty?
}

export function getLists() {
    return performFetch(endpoints.GET_LISTS)
        .then(response => {
            const lists = response.items.map((item, id) => {
                return {
                    id: id,    // Change?
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
                        }
                    }
                }
            });
            const notes = response.notes;
            return { lists, notes };
        });
}

export function getEvents() {
    return performFetch(endpoints.GET_EVENTS)
        .then(response => response.values.map(v => ({
            name: v.event_name,
            requiresConfirmation: v.confirmation_expected || v.date_expected || v.quantity_expected,
            requiresDate: v.date_expected,
            requiresQuantity: v.quantity_expected,
            isDownload: v.returns_pdf
        })));
}

export function postEvent(event, ids, data = {}) {

    const date = (data && data.date) ? formatDate(data.date) : null;
    const eventData = date || data.quantity;

    const requestBody = {
        event_name: event.name,
        request_ids: ids,
        event_data: eventData || ''
    };

    if (event.isDownload) {
        return performDownload(endpoints.SUBMIT_EVENT, requestBody);
    } else {
        return performPost(endpoints.SUBMIT_EVENT, requestBody);
    }
}

export function postListUpdate(list, notes) {
    const items = listToRequestPayload(list);
    const requestBody = { notes, items };

    return performPost(endpoints.SUBMIT_LISTS, requestBody);
}

function responseItemToRequest(item) {
    return {
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
            babyProducts: item.baby_products_required.toLowerCase() === 'true',
            petFood: item.pet_food_required.toLowerCase() === 'true'
        },
        extraInformation: item.extra_information,
        editUrl: item.edit_details_url
    };
}

function listToRequestPayload(list) {
    return list.map(item => {
        const sizes = item.householdSizes;
        return {
            item_description: item.description,
            single_quantity: sizes.single.quantity,
            single_notes: sizes.single.notes,
            family_of_2_quantity: sizes.familyOf2.quantity,
            family_of_2_notes: sizes.familyOf2.notes,
            family_of_3_quantity: sizes.familyOf3.quantity,
            family_of_3_notes: sizes.familyOf3.notes,
            family_of_4_quantity: sizes.familyOf4.quantity,
            family_of_4_notes: sizes.familyOf4.notes,
            ['family_of_5+_quantity']: sizes.familyOf5Plus.quantity,
            ['family_of_5+_notes']: sizes.familyOf5Plus.notes
        };
    });
}

function extractEvent(item) {

    const name = item.event_name;
    const data = item.event_data;
    const date = parseTimestamp(item.event_timestamp);

    return {
        name, data, date
    };
}

