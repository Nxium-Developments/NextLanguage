const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

const searchFiles = require("../index");

const directoryPath = path.join(__dirname, "temp");

/**
 * Returns a path prepended with `directoryPath`
 * @param {...String} paths The array containing the path
 */
const testPath = (...paths) => {
  return path.join(directoryPath, ...paths);
};

describe("searchFiles()", function () {
  before(function (done) {
    /**
     * File structure:
     * temp
     * │   blob.txt
     * │   javascript.js
     * │   words.txt
     * │
     * ├───emptyDir
     * └───innerDir
     *     │   inner.js
     *     │   inner.txt
     *     │
     *     └───src
     *         │   init.py
     *         │
     *         └───components
     *                 app.py
     */

    // temp directory files and directories
    fs.mkdirSync(directoryPath, { recursive: true });

    fs.writeFileSync(testPath("words.txt"), "Words file");
    fs.writeFileSync(testPath("blob.txt"), "Blob file");
    fs.writeFileSync(testPath("javascript.js"), "JS file");

    // temp/empty directory files and directories
    fs.mkdirSync(testPath("emptyDir"), { recursive: true });

    // temp/innerDir directory files and directories
    fs.mkdirSync(testPath("innerDir"), { recursive: true });

    fs.writeFileSync(testPath("innerDir", "inner.txt"), "Inner");
    fs.writeFileSync(testPath("innerDir", "inner.js"), "Inner");

    // temp/innerDir/src/components files and directories
    fs.mkdirSync(testPath("innerDir", "src", "components"), { recursive: true });

    fs.writeFileSync(testPath("innerDir", "src", "components", "app.py"), "import math");
    fs.writeFileSync(testPath("innerDir", "src", "init.py"), "import sys");

    done();
  });

  describe("Should return the correct file paths in the `temp/` directory", function () {
    it("Should return 3 `temp/` file paths with the file extension `txt`", function (done) {
      // Create an array for the expected result
      const expectedResult = [
        testPath("blob.txt"),
        testPath("innerDir", "inner.txt"),
        testPath("words.txt"),
      ];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("txt", directoryPath);

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 2 `temp/` file paths with the file extension `js`", function (done) {
      // Create an array for the expected result
      const expectedResult = [testPath("innerDir", "inner.js"), testPath("javascript.js")];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("js", directoryPath);

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 2 `temp/` file paths with the file extension `py`", function (done) {
      // Create an array for the expected result
      const expectedResult = [
        testPath("innerDir", "src", "components", "app.py"),
        testPath("innerDir", "src", "init.py"),
      ];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("py", directoryPath);

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 1 `temp/innerDir/` file path with the file extension `txt`", function (done) {
      // Create an array for the expected result
      const expectedResult = [testPath("innerDir", "inner.txt")];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("txt", testPath("innerDir"));

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 0 `temp/innerDir/src` file paths with the file extension `txt`", function (done) {
      // Create an array for the expected result
      const expectedResult = [];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("txt", testPath("innerDir", "src"));

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 1 `temp/innerDir/src/components` file paths with the file extension `py`", function (done) {
      // Create an array for the expected result
      const expectedResult = [testPath("innerDir", "src", "components", "app.py")];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("py", testPath("innerDir", "src", "components"));

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });

    it("Should return 0 `temp/emptyDir` file paths with the file extension `cpp`", function (done) {
      // Create an array for the expected result
      const expectedResult = [];

      // Invoke the searchFiles function to test
      const result = searchFiles.searchFiles("cpp", testPath("emptyDir"));

      // Conduct a deep comparison to compare indices
      expect(result).deep.to.equal(expectedResult);
      done();
    });
  });

  after(function (done) {
    fs.rmdirSync(directoryPath, { recursive: true });
    done();
  });
});
