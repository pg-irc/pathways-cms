import fs from 'fs';
import readline from 'readline';

const filename = '../content/topics/bc/markdown/Newcomers-Guide-English.md';

const main =  async () => {
    await processFileLineByLine(filename)
        .catch(err => console.error('Error processing file:', err));
};

async function processFileLineByLine(filePath: string): Promise<void> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        processLine(line);
    }
}

const processLine = (line: string) => {
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
        // do nothing
    } else {
        localizedContent += line + '\n';
    }
};

const getValue = (line: string) => line.split('//')[1];

let chapter = '';
let localizedName = '';
let canonicalName = '';
let localizedContent = '';

const completeTopic = () => {
    if (!localizedContent) {
        return;
    }
    console.log('Chapter:', chapter);
    console.log('LocalizedName:', localizedName);
    console.log('CanonicalName:', canonicalName);
    localizedContent = '';
};

main();
