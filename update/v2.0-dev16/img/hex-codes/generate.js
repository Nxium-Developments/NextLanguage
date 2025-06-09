const fs = require('fs');
const path = require('path');

function generate(name = 'all_colors.json', directory = __dirname) {
    const filePath = path.join(directory, name);
    const stream = fs.createWriteStream(filePath);
    const totalColors = 256 * 256 * 256;

    stream.write('{\n');

    let written = 0;
    for (let i = 0; i < totalColors; i++) {
        const hex = i.toString(16).padStart(6, '0').toUpperCase();
        const name = `COLOR_${i}`;
        stream.write(`  "${name}": "${hex}"${i === totalColors - 1 ? '\n' : ',\n'}`);
        written++;

        // Optional: log progress every million
        if (i % 1000000 === 0) {
            console.log(`Written ${written} colors...`);
        }
    }

    stream.write('}\n');
    stream.end(() => {
        console.log('Finished writing all colors to all_colors.json');
    });
}

const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));
const name = nameArg ? nameArg.split('=')[1] : 'all_colors.json';

const directoryArg = args.find(arg => arg.startsWith('--directory='));
const directory = directoryArg ? directoryArg.split('=')[1] : __dirname;

generate(name, directory);