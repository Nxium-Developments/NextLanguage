# 🔄 Updates Branch

Welcome to the `updates` branch of this repository. This branch contains all the available builds and update metadata for the project. It is used by our update system to fetch and install the correct versions of the software.

## 📁 Structure

Each version of the software is stored in its own folder, named using semantic versioning:

```
updates/
├── v1.0.0/
│ ├── package.zip
│ ├── build.json
│ └── notes.md
├── v1.1.0/
│ ├── package.zip
│ ├── build.json
│ └── notes.md
├── index.json
└── latest.txt
```


### 🗂 Folder Contents

- `package.zip`: The compressed update package for this version.
- `build.json`: Metadata about this specific build (version, type, date, etc.).
- `notes.md`: (Optional) Release notes or changelog for this version.

### 📄 Root Files

- `index.json`: A machine-readable file listing all available builds and their metadata.
- `latest.txt`: Contains the version string of the latest stable release (e.g., `v1.1.0`).

## 🚀 Usage

This branch is accessed programmatically by the update system. Do not edit files manually unless you're publishing a new version using the automated tools (`publisher.js`, etc.).

To publish a new build:

1. Run `node release/js/publisher.js` from the root of your main project.
2. This will:
   - Package the update
   - Generate `build.json`

3. Run `node release/js/indexer.js` from the root of your main project.
4. This will:
   - Index the newest update
   - And update `index.json`

5. Finally, update the `config.json` for the newest build, you just made.
6. Then push everything to the updates branch

## 📌 Notes

- Builds must follow [Semantic Versioning](https://semver.org/) (e.g., `v1.2.3`).
- The updater checks `latest.txt` to determine if a newer version is available.
- For beta, alpha, or experimental builds, use suffixes like `v1.2.3-beta`.

## 🔐 Permissions

Only trusted CI/CD pipelines or authorized maintainers should push changes to this branch.

---

For more information about the update system, visit the [main repository README](../README.md).
