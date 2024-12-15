import fs from 'fs';
import readline from 'readline';
import 'dotenv/config'
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


const main =  async () => {
    await processFile(filename)
        .catch(err => console.error('Error processing file:', err));
};

const processFile = async (filePath: string) => {
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
    console.log('LINE: ', line);
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
let count = 0;

const persistCurrentTopic = async () => {
    if (!localizedContent) {
        return;
    }
    console.log('Persisting ', canonicalName);
    count++;
    if (count > 4) {
        console.log('Skipping ', canonicalName);
        return;
    }
    const topicId = await getTopicId();
    await setLocalizedContent(topicId);
    localizedContent = '';
};

const payload = await getPayload({ config })

const getTopicId = async () => {
    const r1 = await payload.find({ collection: 'topic', where: { canonicalName } });
    if (r1.length > 0) { return r1[0].id; }

    console.log('Creating topic ', canonicalName);

    const chapterId = await getChapterId(chapter);
    const topicTypeId = '675f35950a85d2e36a578ef2';
    const r2 = await payload.create({
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

const getChapterId = async (name: string): Promise<string> => {
    const r1 = await payload.find({ collection: 'chapter', where: { name } });
    if (r1.length > 0) {
        console.log('Found chapter ', JSON.stringify(r1));
        return r1[0].id;
    }

    console.log('Creating chapter ', name);

    const r2 = await payload.create({ collection: 'chapter', data: { name } });
    console.log('Created chapter ', JSON.stringify(r2));
    return r2.id;
};

const setLocalizedContent = async (topicId: string) => {

    console.log('Setting localized content for ', canonicalName);

    await payload.update({
        collection: 'topic',
        id: topicId,
        where: { canonicalName },
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
