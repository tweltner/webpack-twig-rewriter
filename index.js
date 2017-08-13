'use strict';
const argv = require('yargs')
    .usage('Usage: twig-rewriter input.html.twig --manifest|-m manifest.json [--output|-o output.twig.html] [options]')
    .example('twig-rewriter src/index.html.twig -m manifest.json -o dist/index.html.twig', '')
    .options({
        'm': {
            alias: 'manifest',
            demand: 'Please specify the manifest file generated by webpack',
            describe: 'Manifest file from Webpack',
            type: 'string',
        },
        'o': {
            alias: 'output',
            describe: 'Template output file',
            type: 'string', 
        }
    })
    .demand(1)
    .argv;
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(argv._[0], 'UTF-8');
const manifest = JSON.parse(fs.readFileSync(argv.m, 'UTF-8'));
const webpackRegEx = /<%=\swebpack\:(.+)(?:(?!%>).).*?%>/g;
let replaced = '';

replaced = content.replace(webpackRegEx, (match, p1) => {
    return manifest[match];
});

var output = path.parse(argv.o);

if (fs.existsSync(output.dir) === false)
    fs.mkdirSync(output.dir);

fs.writeFileSync(argv.o, replaced, 'UTF-8');