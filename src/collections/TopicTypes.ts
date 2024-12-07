import type { CollectionConfig } from 'payload';

export const TopicTypes: CollectionConfig = {
    slug: 'topictype',
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
