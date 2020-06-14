
export function capitalise(text) {
    return text.charAt(0).toUpperCase(0) + text.slice(1);
}

export function today() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

export function formatAddress(address) {
    return [
        address.line1,
        address.line2,
        address.town,
        address.county,
        address.postcode
    ]
        .filter(line => !!line)
        .join(', ');
}

export function formatHousehold(household) {
    return `${household.total} occupants (${household.adults} adults, ${household.children} children)`;
}

export function isInCongestionZone(postcode) {
    const strippedPostcode = postcode.replace(' ', '');
    const start = strippedPostcode.length < 7
        ? strippedPostcode.substr(0, 4)
        : strippedPostcode.substr(0, 5);

    const formattedStart = start.substr(0, start.length - 1)
        + ' ' + start.substr(start.length - 1, 1);

    return congestionChargePostcodes.includes(formattedStart);
}

const congestionChargePostcodes = [
    'SE1 0',
    'SE1 1',
    'SE1 2',
    'SE1 3',
    'SE1 4',
    'SE1 5',
    'SE1 6',
    'SE1 7',
    'SE1 8',
    'SE1 9',
    'SE11 4',
    'SE11 5',
    'SE11 6'
];