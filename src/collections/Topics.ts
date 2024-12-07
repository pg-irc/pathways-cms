import type { CollectionConfig } from 'payload';

export const Topics: CollectionConfig = {
    slug: 'topic',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'regions', 'chapters', 'topictype'],
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
            type: 'textarea',
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
            label: 'Which chapters does this topic belong to?',
        },
        {
            name: 'topictype',
            type: 'relationship',
            relationTo: 'topictype',
            required: true,
            hasMany: false,
            label: 'What type of topic is this?',   
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
