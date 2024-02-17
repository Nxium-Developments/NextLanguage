# find-file-extension

[![npm version](https://badge.fury.io/js/find-file-extension.svg)](https://badge.fury.io/js/find-file-extension) [![Buid Status](https://travis-ci.com/MathewDavidov/find-file-extension.svg?branch=master)](https://travis-ci.com/github/MathewDavidov/find-file-extension)

The npm package [find-file-extension](https://www.npmjs.com/package/find-file-extension) searches for a specified file type in a given directory or directories and returns an array of file paths. Unlike Node.js's `fs.readdir()`, which only reads through the directory without a `rescursive` option, this program will recursively find all file paths with the given extension within a subdirectory or subdirectories.

## Installation

```shell
npm i find-file-extension
```

## Usage

```js
const { searchFiles } = require("find-file-extension");

// Single directory usage
const filePaths = searchFiles("js", "./src");

// Multiple directory usage
const filePaths = searchFiles("js", "./src", "./test");
const filePaths = searchFiles("jsx", "./src/components", "./src/store", "./src/app");
```
