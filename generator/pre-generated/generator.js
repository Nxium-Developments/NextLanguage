const { existsSync, mkdirSync, writeFileSync } = require('fs')
const path = require('path')

const output = path.join(__dirname, '../../output/')
const packageJSON = path.join(__dirname, '../../output/package.json')

if (existsSync(output)) return false
if (existsSync(packageJSON)) return false

mkdirSync(output);
writeFileSync(packageJSON, '{"name": "@nxium/nextlanguage-generator", "version": "1.0.0", "scripts": { "build": "node bin/generator.js", "start": "node bin/init.js" }}', 'utf8');