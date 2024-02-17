const fs = require("fs");
const path = require("path");

/**
 * Find all files with a given file extension and directory (or directories)
 * @param {String} fileExtension The file extension (e.g. "njk" or "jsx") - no period/dot
 * @param {...String} directoryPaths The directory (or directories) to search in
 * @example
 *   // Single directory usage
 *   const filePaths = searchFiles("js", "./src");
 * @example
 *   // Multiple directory usage
 *   const filePaths = searchFiles("js", "./src", "./test");
 * @example
 *   // Multiple directory usage
 *   const filePaths = searchFiles("jsx", "./src/components", "./src/store", "./src/app");
 * @returns {String[]} An array of all file paths with a given file extension
 */
const searchFiles = (fileExtension, ...directoryPaths) => {
  // Recursive inner function that performs the search and appends to the array
  const getAllFiles = (directoryPath, arrayOfFiles = []) => {
    // Source (modified): https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, "/", file);

      /**
       * For each file/directory in the current directory:
       * If it's a directory, recurse through the directory and
       * repeat this procedure by finding all the files/directories within the directory.
       * Otherwise, if it's a file and the file extension is equal to the given file extension,
       * push it to the array.
       */
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, arrayOfFiles);
      } else if (path.extname(file) === `.${fileExtension}`) {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  };

  const allFilePaths = [];

  /**
   * For every directory path given using the spread (...) operator,
   * call the `getAllFiles` function and append the returned array of file path(s) to `allFilePaths`
   */
  directoryPaths.forEach((directoryPath) => {
    // Loop through each returned array and add the file paths one-by-one
    getAllFiles(directoryPath).forEach((filePath) => {
      allFilePaths.push(filePath);
    });
  });

  return allFilePaths;
};

module.exports = {
  searchFiles,
};
