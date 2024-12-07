// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Topics } from './collections/Topics'
import { TopicTypes } from './collections/TopicTypes'
import { Regions } from './collections/Regions'
import { Chapters } from './collections/Chapters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Topics, Chapters, Regions, TopicTypes, Media],
    localization: {
        locales: [
            'en', 'ar', 'fa', 'fr', 'ko', 'pa', 'tg', 'zh', 'uk'
        ],
        defaultLocale: 'en',
        fallback: true,
    },
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: mongooseAdapter({
        url: process.env.DATABASE_URI || '',
    }),
    sharp,
    plugins: [
        payloadCloudPlugin(),
        // storage-adapter-placeholder
    ],
})
