// to execute: npx tsx ./src/bin/seedTopics.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs';
import readline from 'readline';
import 'dotenv/config'
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LinkNode } from '@payloadcms/richtext-lexical';
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { ListItemNode, ListNode } from '@payloadcms/richtext-lexical/lexical/list';
import { HorizontalRuleNode } from '@payloadcms/richtext-lexical/lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text';
import { LineBreakNode, ParagraphNode, RootNode, TextNode } from 'lexical';

const payload = await getPayload({ config })

const convertMarkdownToLexical = (markdownString: string): string => {
    const editor = createHeadlessEditor({
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            LineBreakNode,
            ParagraphNode,
            RootNode,
            TextNode,
            // CodeNode,
            // CodeHighlightNode,
            // TableNode,
            // TableCellNode,
            // TableRowNode,
            // AutoLinkNode,
            LinkNode,
            HorizontalRuleNode
        ],
        onError: (error) => console.error(error),
    });
    
    editor.update(() => {
        $convertFromMarkdownString(markdownString, TRANSFORMERS);
    }, {discrete: true});
    
    const result = editor.getEditorState().toJSON();
    return JSON.stringify(result);
};

const ALL_LOCALES = {
    en: '',
    ar: '',
    fa: '',
    fr: '',
    ko: '',
    pa: '',
    tl: '',
    zh_CN: '',
    zh_TW: '',
    uk: '',
}

const saveTopic = async (topic) => {
    const result = await payload.create({
        collection: 'topic',
        data: {
            canonicalName: topic.canonicalName,
            localizedName: topic.localizedName['en'],
            content: topic.content['en'],
            chapters: topic.chapters,
            topictype: topic.topictype,
        },
        locale: 'en',
        fallbackLocale: 'en',
    });
    const locales = ['uk', 'fr'];
    for (const locale of locales) {
        if (locale !== 'en' && topic.localizedName[locale] && topic.content[locale]) {
            await payload.update({
                collection: 'topic',
                id: result.id,
                data: {
                    localizedName: topic.localizedName[locale],
                    content: topic.content[locale],
                },
                locale: locale,
                fallbackLocale: 'en',
            });
        }
    }
}

const theTopic = {
    canonicalName: 'topic_id_12',
    localizedName: {
        en: 'name in English',
        uk: 'name in Ukrainian'
    },
    content: {
        en: convertMarkdownToLexical('## heading\ncontent in English'),
        uk: convertMarkdownToLexical('## heading\ncontent in Ukrainian'),
    }, 
    chapters: ['6758aeb570f85c9507213c6d'],
    topictype: '6758af1270f85c9507213da0',
};

// saveTopic(theTopic);


async function processFileLineByLine(filePath: string): Promise<void> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const getValue = (line: string) => line.split('//')[1];

    for await (const line of rl) {
        if (line.startsWith('CHAPTER//')) {
            completeTopic();
            chapter = getValue(line);
        } else if (line.startsWith('TOPIC//')) {
            completeTopic();
            localizedName = getValue(line);
        } else if (line.startsWith('ID//')) {
            completeTopic();
            canonicalName = getValue(line);
        } else if (line.startsWith('MAPS_QUERY//') || line.startsWith('Tags')) {
            completeTopic();
        } else {
            localizedContent += line + '\n';
        }

        console.log('Finished reading the file.');
    }
}

let chapter = '';
let localizedName = '';
let canonicalName = '';
let localizedContent = '';

const getChapter = async (name: string): string => {
    const r1 = await payload.find({
        collection: 'chapter',
        where: { name },
    });
    if (r1.length > 0) { return r1[0].id; }
    const r2 = await payload.create({
        collection: 'chapter',
        data: { name },
    });
    return r2.id;
};

const getTopic = async (topic) => {
    const r1 = await payload.find({
        collection: 'topic',
        where: { canonicalName: topic.canonicalName },
    });
    if (r1.length > 0) { return r1[0].id; }
    const r2 = await payload.create({
        collection: 'topic',
        data: {
            canonicalName: topic.canonicalName,
            localizedName: topic.localizedName['en'],
            content: topic.content['en'],
            chapters: topic.chapters[0],
            topictype: topic.topictype,
        },
        locale: 'en',
        fallbackLocale: 'en',
    });
    return r2.id;
};

const completeTopic = async () => {
    const chapterId = await getChapter(chapter);
    const topicId = await getTopic({
        canonicalName,
        localizedName,
        content: convertMarkdownToLexical(localizedContent),
        chapters: [chapterId],
        topictype: '6758af1270f85c9507213da0',
    // create topic if it doesn't exist
    // update topic if it does exist

    saveTopic({
        canonicalName,
        localizedName: ALL_LOCALES,
        content: ALL_LOCALES,
        chapters: [chapter],
        topictype: '6758af1270f85c9507213da0',
    });
    localizedName = '';
    canonicalName = '';
    localizedContent = '';
};

await processFileLineByLine('../content/topics/bc/markdown/Newcomers-Guide-English.md')
    .catch(err => console.error('Error processing file:', err));
