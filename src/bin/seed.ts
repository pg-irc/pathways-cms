import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const region = await payload.create({
    collection: 'region',
    data: {
        id: 'AB',
        name: 'Alabama',
    },
    locale: 'en',
    user: 'rasmus@peacegeeks.org',
    overrideAccess: true,
});
