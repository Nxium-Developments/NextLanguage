## ✨ Introducing NextLanguage ✨
A new file loader using javascript which allows, a file to be loaded in any language.
This demo, includes index.js running a file named ``npm-test.a`` which cannot be run
in javascript, but with NextLanguage. YOU are able to, in any language.

You can even run it in java, typescript, and even c++ using a different file extension!

For Example: Run Demo

```
// index.js

const { executeNxlFile } = require('@nyxast/nextlanguage')

executeNxlFile('npm-test.a')
```


```
// npm-test.a

console.log('Helloworld')
```

Console Output:

```
user@EXAMPLE-DESKTOP ~/nextlanguage/npm-packaged-test (master)
$ node index.js

Helloworld

```
