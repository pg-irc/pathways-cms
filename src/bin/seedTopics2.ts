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
    processFileSync(filename);
};

const processFileSync = (filePath: string) => {
    const fileDescriptor = fs.openSync(filePath, 'r');
    const bufferSize = 4 * 1024;
    const buffer = Buffer.alloc(bufferSize);
    let leftover = '';
    let bytesRead = 0;
    
    do {
        bytesRead = fs.readSync(fileDescriptor, buffer, 0, bufferSize, null);
        
        console.log('Bytes read: ', bytesRead);
        
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
    console.log('LINE: "' + line + '"');
    if (line.startsWith('CHAPTER//')) {
        await persistCurrentTopic(state);
        state = { ...state, chapter: getValueFromLine(line) };
        console.log('XXX chapter line: ', JSON.stringify(state));

    } else if (line.startsWith('TOPIC//')) {
        await persistCurrentTopic(state);
        state = { ...state, localizedName: getValueFromLine(line) };
        console.log('YYY topic line: ', JSON.stringify(state));

    } else if (line.startsWith('ID//')) {
        await persistCurrentTopic(state);
        state = { ...state, canonicalName: getValueFromLine(line) };
        console.log('ZZZ id line: ', JSON.stringify(state));

    } else if (line.startsWith('MAPS_QUERY//') || line.startsWith('Tags')) {
        // do nothing
    } else {
        state = { ...state, localizedContent: state.localizedContent + line + '\n' };
    }
};

const getValueFromLine = (line: string) => line.split('//')[1];

interface State {
    chapter: string;
    localizedName: string;
    canonicalName: string;
    localizedContent: string;
};

let state: State = {
    chapter: '',
    localizedName: '',
    canonicalName: '',
    localizedContent: ''
};

const persistCurrentTopic = async (theState: State) => {
    if (theState.localizedContent.trim() === '') { return; }
    
    console.log('Persisting topic with canonical nane "', theState.canonicalName, '"');
    
    return getTopicId(theState).
        then((topicId) => { return setLocalizedContent(topicId, theState); }).
        then(() => {
            state = { ...state, localizedContent: '' }
        });
};

const payload = await getPayload({ config })

const getTopicId = async (state: State) => {
    console.log('Getting topic id for ', state.canonicalName);

    return payload.find({ collection: 'topic', where: { canonicalName: state.canonicalName } }).
        then(found => {
            return found.docs.length > 0
                ? found.docs[0].id
                : getChapterId(state).
                    then(chapterId => {
                        return payload.create({
                            collection: 'topic',
                            data: {
                                canonicalName: state.canonicalName,
                                chapters: [chapterId],
                                topictype: '675f35950a85d2e36a578ef2',
                            },
                            locale,
                            fallbackLocale: locale,
                        }).then(result => result.id);
                    });
        });
};

const getChapterId = async (state: State): Promise<string> => {
    console.log('Getting chapter id for ', state.chapter);

    return payload.find({ collection: 'chapter', where: { name: state.chapter } }).
        then(result => {
            return result.docs.length > 0
                ? result.docs[0].id
                : payload.create({ collection: 'chapter', data: { name: state.chapter } }).
                    then(result => result.id);
        });
};

const setLocalizedContent = async (topicId: string, state: State): Promise<any> => {
    console.log('Setting localized content for ', state.canonicalName, ' in locale ', locale);

    return payload.update({
        collection: 'topic',
        id: topicId,
        data: {
            localizedName: state.localizedName,
            content: convertMarkdownToLexical(state.localizedContent),
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
