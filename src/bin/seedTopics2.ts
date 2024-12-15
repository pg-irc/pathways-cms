import fs from 'fs';
import readline from 'readline';
import { getPayload } from 'payload'
import config from '@payload-config'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LinkNode } from '@payloadcms/richtext-lexical';
import { ListItemNode, ListNode } from '@payloadcms/richtext-lexical/lexical/list';
import { HorizontalRuleNode } from '@payloadcms/richtext-lexical/lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text';
import { LineBreakNode, ParagraphNode, RootNode, TextNode } from 'lexical';


const filename = '../content/topics/bc/markdown/Newcomers-Guide-English.md';
const locale = 'en';
const region = 'bc';

let count = 0;

const main =  async () => {
    await processFileLineByLine(filename)
        .catch(err => console.error('Error processing file:', err));
};

async function processFileLineByLine(filePath: string): Promise<void> {
    const theFileStream = fs.createReadStream(filePath);
    const theLineReader = readline.createInterface({
        input: theFileStream,
        crlfDelay: Infinity
    });
    for await (const line of theLineReader) {
        processLine(line);
    }
}

const processLine = (line: string) => {
    if (line.startsWith('CHAPTER//')) {
        persistCurrentTopic();
        chapter = getValueFromLine(line);

    } else if (line.startsWith('TOPIC//')) {
        persistCurrentTopic();
        localizedName = getValueFromLine(line);

    } else if (line.startsWith('ID//')) {
        persistCurrentTopic();
        canonicalName = getValueFromLine(line);

    } else if (line.startsWith('MAPS_QUERY//') || line.startsWith('Tags')) {
        // do nothing
    } else {
        localizedContent += line + '\n';
    }
};

const getValueFromLine = (line: string) => line.split('//')[1];

let chapter = '';
let localizedName = '';
let canonicalName = '';
let localizedContent = '';

const persistCurrentTopic = () => {
    if (!localizedContent) {
        return;
    }
    count++;
    if (count > 4) {
        console.log('Skipping ', canonicalName);
        return;
    }
    const topicId = getTopicId();
    setLocalizedContent(topicId);
    localizedContent = '';
};

const payload = await getPayload({ config })

const getTopicId = () => {
    const r1 = payload.find({ collection: 'topic', where: { canonicalName } });
    if (r1.length > 0) { return r1[0].id; }

    const chapterId = getChapterId(chapter);
    const topicTypeId = '6758af0570f85c9507213d82';
    const r2 = payload.create({
        collection: 'topic',
        data: {
            canonicalName,
            chapters: [chapterId],
            topictype: topicTypeId,
        },
        locale,
        fallbackLocale: locale,
    });
    return r2.id;
};

const getChapterId = async (name: string): string => {
    const r1 = await payload.find({ collection: 'chapter', where: { name } });
    if (r1.length > 0) { return r1[0].id; }

    const r2 = await payload.create({ collection: 'chapter', data: { name } });
    return r2.id;
};

const setLocalizedContent = async (topicId: string) => {
    await payload.update({
        collection: 'topic',
        id: topicId,
        data: {
            localizedName: localizedName,
            content: convertMarkdownToLexical(localizedContent),
        },
        locale,
        fallbackLocale: 'en',
    });
};

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

main();
