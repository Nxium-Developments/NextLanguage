# 🔄 Updates Branch

Welcome to the `updates` branch of NextLanguage. This branch contains all the available builds and update metadata for the project. It is used by our update system to fetch and install the correct versions of the software.

## 📁 Structure

Each version of the software is stored in its own folder, named using semantic versioning:

```
root/
├── release/
│ ├── js/
│ │ ├── cleanup.js
│ │ ├── index.js
│ │ ├── indexer.js
│ │ ├── package.js
│ │ └── publisher.js
│ ├── build.json
│ ├── cleanup.json
│ ├── config.json
│ └── README.md
├── v1.0.0-dev/
│ ├── nextlang-win.exe
│ ├── nextlang-linux.exe
│ ├── index.js
│ ├── package.js
│ ├── build.json
│ └── config.json
├── v1.0.0-alpha/
│ ├── nextlang-win.exe
│ ├── nextlang-linux.exe
│ ├── index.js
│ ├── package.js
│ ├── build.json
│ └── config.json
├── v1.0.0-beta/
│ ├── nextlang-win.exe
│ ├── nextlang-linux.exe
│ ├── index.js
│ ├── package.js
│ ├── build.json
│ └── config.json
├── v1.1.0-stable/
│ ├── nextlang-win.exe
│ ├── nextlang-linux.exe
│ ├── index.js
│ ├── package.js
│ ├── build.json
│ ├── changelogs.md
│ └── config.json
├── README.md
└── index.json
```


### 🗂 Folder Contents

- `nextlang-win.exe`: The (windows version of the) executable.
- `nextlang-linux.exe`: The (linux version of the) executable.
- `build.json`: Metadata about this specific build (version, type, date, etc.).
- `config.json`: Configuration files for the specific build (after install).
- `index.js`: The update checker & indexer (Marks if an update is avaliable).
- `package.js`: The update installer (applies the update after marking).
- `changelogs.md`: (Optional) Release notes or changelog for this version.

# 💾 Release Files
Contains the files & templates to publish a release/build.
- `js/indexer.js`: Reindexes the entire update directory, when posting a new build.
- `js/publisher.js`: Automatically writes the `build.json` file.
- `js/cleanup.js`: Contains the latest template for cleaning up, after an update.
- `js/package.js`: Contains the latest template for applying & installing an update.
- `js/index.js`: Contains the latest template for marking & downloading the [updates](https://github.com/Nxium-Developments/NextLanguage/tree/updates) branch.

### 📄 Root Files

- `index.json`: A machine-readable file listing all available builds and their metadata.
- `latest.txt`: Contains the version string of the latest stable release (e.g., `v1.1.0`).

## 🚀 Usage

This branch is accessed programmatically by the update system. Do not edit files manually unless you're publishing a new version using the automated tools (`publisher.js`, etc.).

To publish a new build:

1. Download `release/js/publisher.js` into your update package.
2. Run `node update-package/publisher.js`
3. This will:
   - Package the update
   - Generate `build.json`
4. Update the `config.json` of your update package. (to include the new version)
5. Upload your update package onto the [updates](https://github.com/Nxium-Developments/NextLanguage/tree/updates) branch.
6. Rename your update package (`update-package`) to the version of the update, you're publishing. (`update-package` -> `v1.2.3-stable`)
7. Run `node release/js/indexer.js` from the root of the [updates](https://github.com/Nxium-Developments/NextLanguage/tree/updates) branch.
8. This will:
   - Index the newest update
   - And update `index.json`
9. Run `node release/js/updateLatest.js` from the root of [updates](https://github.com/Nxium-Developments/NextLanguage/tree/updates) branch.
10. This will:
   - Get a index of all build versions avaliable
   - Select the latest build version
   - Save the latest build version to `latest.txt`
11. Finally push everything to the [updates](https://github.com/Nxium-Developments/NextLanguage/tree/updates) branch.

## 📌 Notes

- Builds must follow [Semantic Versioning](https://semver.org/) (e.g., `v1.2.3`).
- The updater checks `latest.txt` to determine if a newer version is available.
- For beta, alpha, or experimental builds, use suffixes like `v1.2.3-beta`.
- For newer beta, alpha, or experimental builds of the same version, use suffixes like `v1.2.3-beta.1`.

## 🔐 Permissions

Only trusted CI/CD pipelines or authorized maintainers should push changes to this branch.

---

For more information about the update system, visit the [main repository README](../README.md).
