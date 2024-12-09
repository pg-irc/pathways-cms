
// to execute: npx tsx ./src/bin/seedRegions.ts


// https://lexical.dev/docs/packages/lexical-headless
// has an example of converting to markdown in a rest get call, very similar what we will do

import { $createParagraphNode, $createTextNode, $getRoot } from '@payloadcms/richtext-lexical/lexical';
import { $convertToMarkdownString, TRANSFORMERS } from '@payloadcms/richtext-lexical/lexical/markdown';
import { createHeadlessEditor } from '@lexical/headless'


const editor = createHeadlessEditor({
    nodes: [],
    onError: () => { },
});

editor.update(() => {
    $getRoot().append(
        $createParagraphNode().append(
            $createTextNode('Hello world')
        )
    )
});

editor.update(() => {
    const markdown = $convertToMarkdownString(TRANSFORMERS);
    console.log(markdown);
});
