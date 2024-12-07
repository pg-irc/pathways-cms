import type { CollectionConfig } from 'payload';

export const TopicTypes: CollectionConfig = {
    slug: 'topictype',
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
