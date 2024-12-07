import type { CollectionConfig } from 'payload';

export const Topics: CollectionConfig = {
    slug: 'topic',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'topictype', 'regions', 'chapters'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
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
            name: 'chapters',
            type: 'relationship',
            relationTo: 'chapter',
            required: false,
            hasMany: true,
        },
        {
            name: 'topictype',
            type: 'relationship',
            relationTo: 'topictype',
            required: true,
            hasMany: false,
        },
        {
            name: 'regions',
            type: 'relationship',
            relationTo: 'region',
            required: false,
            hasMany: true,
        }
    ],
};
