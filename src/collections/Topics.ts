import type { CollectionConfig } from 'payload';

export const Topics: CollectionConfig = {
    slug: 'topic',
    admin: {
        // use a non-localized field as the canonical name, 
        // so that the name field can be localized and the canonical 
        // name can be used as a unique identifier
        useAsTitle: 'canonicalName',
        defaultColumns: ['canonicalName', 'topictype', 'regions', 'chapters'],
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'canonicalName',
            type: 'text',
            required: true,
            unique: true,
            localized: false,
        },
        {
            name: 'localizedName',
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
