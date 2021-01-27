import fetch from 'cross-fetch';
import { format, parse } from 'date-fns';
import { DATE_FORMAT_REQUEST, DATE_FORMAT_TIMESTAMP } from '../constants';

const endpoints = {
    GET_REQUESTS: 'bff/summary',
    GET_SINGLE_REQUEST: 'bff/details/',
    GET_LISTS: 'api/lists/',
    GET_ACTIONS: 'api/events/distinct/actions',
    GET_STATUSES: 'api/events/distinct/statuses',
    SUBMIT_ACTION: 'bff/actions/',
    SUBMIT_STATUS: 'bff/statuses/',
    SUBMIT_LISTS: 'api/lists/'
};


function performFetch(url) {
    return fetch(url, { cache: 'no-cache' })
        .then(handleErrors)
        .then(response => response.json())
}

function performPost(url, data = {}) {
    return fetch(url, {
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(handleErrors)
        .then(response => response.json())
}

function performDownload(url, data = {}) {
    return fetch(url, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(handleErrors)
        .then(async response => ({
            name: extractFileNameFromResponse(response),
            blob: await response.blob()
        }))
        .then(({ name, blob }) => {

            // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
            const newBlob = new Blob([blob], { type: 'application/pdf' });

            // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
            } else {
                // For other browsers: create a link pointing to the ObjectURL containing the blob.
                const objUrl = window.URL.createObjectURL(newBlob);

                let link = document.createElement('a');
                link.href = objUrl;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                link.remove();

                // For Firefox it is necessary to delay revoking the ObjectURL.
                setTimeout(() => { window.URL.revokeObjectURL(objUrl); }, 250);
            }

        });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function extractFileNameFromResponse(response) {
    const dispositions = response.headers.get('content-disposition').split(';');
    const token = 'filename=';
    return dispositions.reduce((name, disposition) => {
        if (disposition.indexOf(token) > -1) {
            return disposition
                .replace(token, '')
                .replace(/"/g, '')
                .trim();
        }
        return name;
    }, 'download.pdf');
}

function encodeParams(params) {
    return '?' + Object.entries(params)
        .map(param => param.map(_ => _ || '').map(encodeURIComponent).join('='))
        .join('&');
}

function formatDate(date) {
    if (!date) return '';
    return format(date, DATE_FORMAT_REQUEST);
}

function parseDate(text, format = DATE_FORMAT_REQUEST) {
    return parse(text, format, new Date())
}

function parseTimestamp(timestamp) {
    if (!timestamp) return null;
    return parse(timestamp.substr(0, 19).replace('T', ' '), DATE_FORMAT_TIMESTAMP, new Date());
}

export function getRequests(filters = {}, page = 1, refreshCache=false) {

    const dates = filters.dates || {};
    const params = {
        page: page,
        per_page: 100,
        start_date: formatDate(dates.start),
        end_date: formatDate(dates.end),
        client_full_names: filters.name,
        voucher_numbers: filters.referenceNumber,
        postcodes: filters.postcode,
        refresh_cache: refreshCache
    };

    const url = endpoints.GET_REQUESTS + encodeParams(params);
    return performFetch(url)
        .then(response => {

            const result = response.items.map(item => ({
                id: item.request_id,
                fullName: item.client_full_name,
                householdSize: item.household_size,
                voucherNumber: item.voucher_number,
                packingDate: parseDate(item.packing_date, 'dd/MM/yyyy'),
                timeOfDay: item.time_of_day,
                event: extractEvent(item),
                postcode: item.postcode,
                isInCongestionZone: item.congestion_zone,
                flagForAttention: item.flag_for_attention
            }));

            const paging = {
                page: response.page,
                totalPages: response.total_pages,
                totalItems: response.total_items,
                pageSize: response.per_page
            }

            const editUrl = response.form_submit_url;

            return { result, paging, editUrl };
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
                    id: id,
                    description: item.item_description,
                    householdSizes: {
                        familyOf1: {
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
                        familyOf5: {
                            quantity: item.family_of_5_quantity,
                            notes: item.family_of_5_notes
                        },
                        familyOf6: {
                            quantity: item.family_of_6_quantity,
                            notes: item.family_of_6_notes
                        },
                        familyOf7: {
                            quantity: item.family_of_7_quantity,
                            notes: item.family_of_7_notes
                        },
                        familyOf8: {
                            quantity: item.family_of_8_quantity,
                            notes: item.family_of_8_notes
                        },
                        familyOf9: {
                            quantity: item.family_of_9_quantity,
                            notes: item.family_of_9_notes
                        },
                        familyOf10Plus: {
                            quantity: item.family_of_10plus_quantity,
                            notes: item.family_of_10plus_notes
                        }
                    }
                }
            });
            const notes = response.notes;
            return { lists, notes };
        });
}

export function getStatuses() {
    return performFetch(endpoints.GET_STATUSES)
        .then(response => response.items.map(v => ({
            name: v.event_name,
            requiresConfirmation: v.confirmation_expected,
            confirmationLabel: v.confirmation_label,
            requiresDate: v.date_expected,
            requiresName: v.name_expected,
            requiresQuantity: v.quantity_expected,
            isDownload: v.returns_pdf
        })));
}

export function getActions() {
    return performFetch(endpoints.GET_ACTIONS)
        .then(response => response.items.map(v => ({
            name: v.event_name,
            requiresConfirmation: v.confirmation_expected,
            confirmationLabel: v.confirmation_label,
            requiresDate: v.date_expected,
            requiresName: v.name_expected,
            requiresQuantity: v.quantity_expected,
            isDownload: v.returns_pdf
        })));
}

export function postEvent(event, ids, type, data = {}) {

    const url = (type === 'status')
        ? endpoints.SUBMIT_STATUS
        : endpoints.SUBMIT_ACTION;

    const date = (data && data.date && event.requiresDate) ? formatDate(data.date) : null;
    const eventData = date || data.name || data.quantity;

    const requestBody = {
        event_name: event.name,
        request_ids: ids,
        event_data: eventData || ''
    };

    if (event.isDownload) {
        return performDownload(url, requestBody);
    } else {
        return performPost(url, requestBody);
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
        voucherNumber: item.voucher_number,
        fullName: item.client_full_name,
        phoneNumber: item.phone_number,
        delivery: {
            date: item.packing_date,
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
            ageAndGenderOfChildren: item.age_and_gender_of_children
        },
        requirements: {
            dietary: item.dietary_requirements,
            feminineProducts: item.feminine_products_required,
            babyProducts: item.baby_products_required,
            petFood: item.pet_food_required,
            other: item.other_requirements
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
            single_quantity: sizes.familyOf1.quantity,
            single_notes: sizes.familyOf1.notes,
            family_of_2_quantity: sizes.familyOf2.quantity,
            family_of_2_notes: sizes.familyOf2.notes,
            family_of_3_quantity: sizes.familyOf3.quantity,
            family_of_3_notes: sizes.familyOf3.notes,
            family_of_4_quantity: sizes.familyOf4.quantity,
            family_of_4_notes: sizes.familyOf4.notes,
            family_of_5_quantity: sizes.familyOf5.quantity,
            family_of_5_notes: sizes.familyOf5.notes,
            family_of_6_quantity: sizes.familyOf6.quantity,
            family_of_6_notes: sizes.familyOf6.notes,
            family_of_7_quantity: sizes.familyOf7.quantity,
            family_of_7_notes: sizes.familyOf7.notes,
            family_of_8_quantity: sizes.familyOf8.quantity,
            family_of_8_notes: sizes.familyOf8.notes,
            family_of_9_quantity: sizes.familyOf9.quantity,
            family_of_9_notes: sizes.familyOf9.notes,
            family_of_10plus_quantity: sizes.familyOf10Plus.quantity,
            family_of_10plus_notes: sizes.familyOf10Plus.notes
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

