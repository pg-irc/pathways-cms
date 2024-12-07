import type { CollectionConfig } from 'payload';

export const Chapters: CollectionConfig = {
    slug: 'chapter',
    admin: {
        useAsTitle: 'id',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'id',
            type: 'text',
            required: true,
            unique: true,
        },
    ],
};
