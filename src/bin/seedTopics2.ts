import fs from 'fs';
import readline from 'readline';
import 'dotenv/config'
import { BulkOperationResult, getPayload } from 'payload'
import config from '@payload-config'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LinkNode } from '@payloadcms/richtext-lexical';
import { ListItemNode, ListNode } from '@payloadcms/richtext-lexical/lexical/list';
import { HorizontalRuleNode } from '@payloadcms/richtext-lexical/lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text';
import { LineBreakNode, ParagraphNode, RootNode, TextNode } from 'lexical';

// const filename = '../content/topics/bc/markdown/Newcomers-Guide-English.md';
const filename = './markdown-4-items.md';
const locale = 'en';
const region = 'bc';


const main =  async () => {
    await processFile(filename)
        .catch(err => console.error('Error processing file:', err));
};

const oldProcessFile = async (filePath: string) => {
    console.log('Processing file: ', filePath);

    const theFileStream = fs.createReadStream(filePath);
    const theLineReader = readline.createInterface({
        input: theFileStream,
        crlfDelay: Infinity
    });
    for await (const line of theLineReader) {
        processLine(line);
    }
}

const processFile = (filePath: string) => {
    const fileDescriptor = fs.openSync(filePath, 'r');
    const bufferSize = 4 * 1024;
    const buffer = Buffer.alloc(bufferSize);
    let leftover = '';
    let bytesRead = 0;
    
    do {
        bytesRead = fs.readSync(fileDescriptor, buffer, 0, bufferSize, null);
        const chunk = buffer.toString('utf8', 0, bytesRead);
        const lines = (leftover + chunk).split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
            processLine(lines[i]);
        }
        leftover = lines[lines.length - 1];
    } while (bytesRead === bufferSize);

    if (leftover) {
        processLine(leftover);
    }
    fs.closeSync(fileDescriptor);
    console.log('Finished reading the file.');
};

const processLine = async (line: string) => {
    console.log('LINE: ', line);
    if (line.startsWith('CHAPTER//')) {
        await persistCurrentTopic();
        chapter = getValueFromLine(line);

    } else if (line.startsWith('TOPIC//')) {
        await persistCurrentTopic();
        localizedName = getValueFromLine(line);

    } else if (line.startsWith('ID//')) {
        await persistCurrentTopic();
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
    if (!localizedContent) { return; }
    
    console.log('Persisting topic: ', canonicalName);
    
    return getTopicId().
        then((topicId) => { return setLocalizedContent(topicId); }).
        then(() => { localizedContent = ''; });
};

const payload = await getPayload({ config })

const getTopicId = async () => {
    console.log('Getting topic id for ', canonicalName);

    return payload.find({ collection: 'topic', where: { canonicalName } }).
        then(found => {
            return found.docs.length > 0
                ? found.docs[0].id
                : getChapterId(chapter).
                    then(chapterId => {
                        return payload.create({
                            collection: 'topic',
                            data: {
                                canonicalName,
                                chapters: [chapterId],
                                topictype: '675f35950a85d2e36a578ef2',
                            },
                            locale,
                            fallbackLocale: locale,
                        }).id;
                    });
        });
};

const getChapterId = async (name: string): Promise<string> => {
    console.log('Getting chapter id for ', name);

    return payload.find({ collection: 'chapter', where: { name } }).
        then(r1 => {
            return r1.length > 0
                ? r1[0].id
                : payload.create({ collection: 'chapter', data: { name } }).id;
        });
};

const setLocalizedContent = async (topicId: string): Promise<any> => {
    console.log('Setting localized content for ', canonicalName, ' in locale ', locale);

    return payload.update({
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
