// to execute: npx tsx ./src/bin/seedTopics.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import 'dotenv/config'
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LinkNode } from '@payloadcms/richtext-lexical';
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { ListItemNode, ListNode } from '@payloadcms/richtext-lexical/lexical/list';
import { HorizontalRuleNode } from '@payloadcms/richtext-lexical/lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text';
import { $getRoot, LineBreakNode, ParagraphNode, RootNode, TextNode } from 'lexical';

const payload = await getPayload({ config })

const MARKDOWN_NODES = [
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
];

const editor = createHeadlessEditor({
    nodes: MARKDOWN_NODES,
    onError: (error) => console.error(error),
});

const markdownString = 'one\n\ntwo\n\nthree\nfour\n\n## Heading\n\n- list item 1\n- list item 2\n\n> quote\n\n---\n\n[link](https://example.com)';

editor.update(() => {

    $convertFromMarkdownString(markdownString, TRANSFORMERS);

    const root = $getRoot();
    console.log('Root node children:', root.getChildren());

    root.getChildren().forEach((node, index) => {
        // the content is there, but it is not included when converting to JSON
        console.log(`Node ${index}:`, node.getType(), node.getTextContent());
    });

    // this gives the wrong result
    const lexicalJSON = editor.getEditorState().toJSON();
    console.log('Editor state', JSON.stringify(lexicalJSON));
}, {discrete: true});


// this gives the correct result
const lexicalJSON = editor.getEditorState().toJSON();
console.log('Editor state outside', JSON.stringify(lexicalJSON));


const markdownToLexical = (markdownString: string): string => {
    const editor = createHeadlessEditor({
        nodes: MARKDOWN_NODES,
        onError: (error) => console.error(error),
    });
    
    editor.update(() => {
        $convertFromMarkdownString(markdownString, TRANSFORMERS);
    });
    
    const result = editor.getEditorState().toJSON();
    console.log('Editor state', JSON.stringify(result));

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
/*
await payload.create({
    collection: 'topic',
    data: {
        canonicalName: 'topic_id_3',
        localizedName: 'aa',
        content: 'bb',
        chapters: ['6758aeb570f85c9507213c6d'],
        topictype: '6758af1270f85c9507213da0',
    },
    locale: 'fr',
    fallbackLocale: 'en',
});

await payload.update({
    collection: 'topic',
    id: '675dab8da1908e1cf07accc0',
    data: {
        //canonicalName: 'topic_id_2',
        localizedName: 'name in Ukrainian',
        content: 'content in Ukrainian',
        //chapters: ['6758aeb570f85c9507213c6d'],
        //topictype: '6758af1270f85c9507213da0',
    },
    locale: 'uk',
    //fallbackLocale: 'en',
});
*/
const theTopic = {
    canonicalName: 'topic_id_9',
    localizedName: {
        en: 'name in English',
        uk: 'name in Ukrainian'
    },
    content: {
        en: markdownToLexical('## heading\ncontent in English'),
        uk: markdownToLexical('## heading\ncontent in Ukrainian'),
    }, 
    chapters: ['6758aeb570f85c9507213c6d'],
    topictype: '6758af1270f85c9507213da0',
};

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

saveTopic(theTopic);
