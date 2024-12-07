import type { CollectionConfig } from 'payload';

export const Topics: CollectionConfig = {
    slug: 'topic',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
        },
        {
            name: 'heroimage',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'listImage',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'regions',
            type: 'relationship',
            relationTo: 'region',
            required: false,
            hasMany: true,
            label: 'The topic is relevant to which regions?',
        }
    ],
};
