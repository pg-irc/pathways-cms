import type { CollectionConfig } from 'payload';

export const Chapters: CollectionConfig = {
    slug: 'chapter',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            unique: true,
        },
    ],
};
