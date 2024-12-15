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
    console.log('Line ', line)
};

main();
