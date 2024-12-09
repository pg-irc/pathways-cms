import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LinkNode } from '@payloadcms/richtext-lexical';
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { ListItemNode, ListNode } from '@payloadcms/richtext-lexical/lexical/list';
import { HorizontalRuleNode } from '@payloadcms/richtext-lexical/lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text';
import { $getRoot, LineBreakNode, ParagraphNode, RootNode, TextNode } from 'lexical';


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

const markdownString = 'one\n\ntwo\n\nthree\nfour';

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
