import type { CollectionConfig } from 'payload';

export const SoftSkillsQuestions: CollectionConfig = {
    slug: 'softskillsquestion',
    fields: [
        {
            name: 'text',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'answers',
            type: 'array',
            required: true,
            minRows: 4,
            maxRows: 4,
            fields: [
                {
                    type: 'text',
                    name: 'text',
                    required: true,
                    localized: true,
                },
                {
                    type: 'checkbox',
                    name: 'isCorrect',
                    required: true,
                    defaultValue: false,
                },
                {
                    type: 'text',
                    name: 'reason',
                    required: true,
                    localized: true,
                }
            ]
        }
    ],
};
