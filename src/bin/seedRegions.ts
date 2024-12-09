// to execute: npx tsx ./src/bin/seedRegions.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import 'dotenv/config'

const payload = await getPayload({ config })

const data = [
    { "name": "Alabama", "id": "AL" },
    { "name": "Alaska", "id": "AK" },
    { "name": "Arizona", "id": "AZ" },
    { "name": "Arkansas", "id": "AR" },
    { "name": "California", "id": "CA" },
    { "name": "Colorado", "id": "CO" },
    { "name": "Connecticut", "id": "CT" },
    { "name": "Delaware", "id": "DE" },
    { "name": "Florida", "id": "FL" },
    { "name": "Georgia", "id": "GA" },
    { "name": "Hawaii", "id": "HI" },
    { "name": "Idaho", "id": "ID" },
    { "name": "Illinois", "id": "IL" },
    { "name": "Indiana", "id": "IN" },
    { "name": "Iowa", "id": "IA" },
    { "name": "Kansas", "id": "KS" },
    { "name": "Kentucky", "id": "KY" },
    { "name": "Louisiana", "id": "LA" },
    { "name": "Maine", "id": "ME" },
    { "name": "Maryland", "id": "MD" },
    { "name": "Massachusetts", "id": "MA" },
    { "name": "Michigan", "id": "MI" },
    { "name": "Minnesota", "id": "MN" },
    { "name": "Mississippi", "id": "MS" },
    { "name": "Missouri", "id": "MO" },
    { "name": "Montana", "id": "MT" },
    { "name": "Nebraska", "id": "NE" },
    { "name": "Nevada", "id": "NV" },
    { "name": "New Hampshire", "id": "NH" },
    { "name": "New Jersey", "id": "NJ" },
    { "name": "New Mexico", "id": "NM" },
    { "name": "New York", "id": "NY" },
    { "name": "North Carolina", "id": "NC" },
    { "name": "North Dakota", "id": "ND" },
    { "name": "Ohio", "id": "OH" },
    { "name": "Oklahoma", "id": "OK" },
    { "name": "Oregon", "id": "OR" },
    { "name": "Pennsylvania", "id": "PA" },
    { "name": "Rhode Island", "id": "RI" },
    { "name": "South Carolina", "id": "SC" },
    { "name": "South Dakota", "id": "SD" },
    { "name": "Tennessee", "id": "TN" },
    { "name": "Texas", "id": "TX" },
    { "name": "Utah", "id": "UT" },
    { "name": "Vermont", "id": "VT" },
    { "name": "Virginia", "id": "VA" },
    { "name": "Washington", "id": "WA" },
    { "name": "West Virginia", "id": "WV" },
    { "name": "Wisconsin", "id": "WI" },
    { "name": "Wyoming", "id": "WY" },
    { "name": "District of Columbia", "id": "DC" },
    { "name": "Alberta", "id": "AB" },
    { "name": "British Columbia", "id": "BC" },
    { "name": "Manitoba", "id": "MB" },
    { "name": "New Brunswick", "id": "NB" },
    { "name": "Newfoundland and Labrador", "id": "NL" },
    { "name": "Nova Scotia", "id": "NS" },
    { "name": "Ontario", "id": "ON" },
    { "name": "Prince Edward Island", "id": "PE" },
    { "name": "Quebec", "id": "QC" },
    { "name": "Saskatchewan", "id": "SK" },
    { "name": "Northwest Territories", "id": "NT" },
    { "name": "Nunavut", "id": "NU" },
    { "name": "Yukon", "id": "YT" }
];

let promises = [];
for (const region of data) {
    promises.push(payload.create({
        collection: 'region',
        data: region,
        locale: 'en'
    }));
}

await Promise.all(promises);
