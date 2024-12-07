import type { CollectionConfig } from 'payload';

export const Regions: CollectionConfig = {
    slug: 'region',
    admin: {
        defaultColumns: ['id', 'name'],
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'id',
            type: 'text',
            label: 'Two letter abbreviation',
            required: true,
            unique: true,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            unique: true,
        },
    ],
};
