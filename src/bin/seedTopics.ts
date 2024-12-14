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

console.log(JSON.stringify({
    ...ALL_LOCALES, en: 'Test in English', fr: 'Test in French'
}));

await payload.create({
    collection: 'topic',
    data: {
        canonicalName: 'topic_id',
        localizedName: { ...ALL_LOCALES, en: 'Test in English', fr: 'Test in French' },
        //localizedName: { English: 'Test in English', French: 'Test in French', },
        //localizedName: 'Test in English',
        //content: { en: 'content in English', fr: 'content in French', },
        //content: 'content in English',
        content: { ...ALL_LOCALES, en: '', fr: '' },
        chapters: ['Education'],
        topictype: 'test',
    },
    locale: 'en',
    fallbackLocale: 'en',
});
