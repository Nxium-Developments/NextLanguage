const fs = require('fs');
const date = require('date-and-time');


const now = new Date();
const pattern = date.compile('YYYY-MM-DD-ss');
const currenttime = date.format(now, pattern);
const nxlf = fs.readFileSync('config.nxconf', 'utf8');

// Function to read and execute .nxl file
function executeNxlFile(filePath) {
    // Read the contents of the .nxl file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Execute the NXL code using eval()
            eval(data);
        } catch (e) {
            console.error('Error executing NXL code:', e);
        }
    });
}

if (!fs.existsSync('config.nxconf')) {
    const filePath = process.argv[2];

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'console.log(`Hello World`)', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }

    if (fs.existsSync('config.nxconf')) {
        const filePath = fs.readFileSync('config.nxconf', 'utf8');
    
        // Execute the .nxl file
        executeNxlFile(filePath);
    } else if (!fs.existsSync('config.nxconf')) {
        const filePath = process.argv[2];
    
        if (!filePath) {
            console.error('Please provide the path to the .nxl file as an argument.');
            process.exit(1);
        } else if (!fs.existsSync('config.nxconf')) {
            if (!fs.existsSync('config.nxconf')) {
                fs.writeFile('config.nxconf', filePath, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            }
        }
    
        // Execute the .nxl file
        executeNxlFile(filePath);
    }
} else {
    if (fs.existsSync('config.nxconf')) {
        const filePath = fs.readFileSync('config.nxconf', 'utf8');
    
        // Execute the .nxl file
        executeNxlFile(filePath);
    } else if (!fs.existsSync('config.nxconf')) {
        const filePath = process.argv[2];
    
        if (!filePath) {
            console.error('Please provide the path to the .nxl file as an argument.');
            process.exit(1);
        } else if (!fs.existsSync('config.nxconf')) {
            if (!fs.existsSync('config.nxconf')) {
                fs.writeFile('config.nxconf', filePath, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            }
        }
    
        // Execute the .nxl file
        executeNxlFile(filePath);
    }
}

if (!fs.existsSync('./build.config.nxlf')) {
    fs.mkdirSync('./build/lib/log', { recursive: true });
    fs.mkdirSync('./build/lib/export', { recursive: true });
    fs.mkdirSync('./build/patches', { recursive: true });
    
    fs.writeFileSync('./build.config.nxlf', 'true', 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
    
    fs.writeFileSync('./build/patches/temp.txt', 'temp', 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    
    fs.writeFileSync('./build/lib/export/temp.txt', 'temp', 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

fs.writeFileSync('./build/lib/log/' + currenttime + '-NXL_Debug.log', `
    You are currently using an unofficial version of NextLanguage.
    Any changes made to this build is unofficial and not is not made
    by the official maintainer and development team of NextLanguage.

    This build is maintained by AshleyAst, instead of Nxium Developments
    and is not affiliated with Nxium Developments. This is a fork of the
    official NextLanguage build Repositories, and is not made by Nxium.

    Additional Information:

        Git: https://github.com/AshelyAst/NextLanguage-Unofficial
        Application: init.js

    Ending Additonal Info Section
    
    Visit https://github.com/Nxium-Developments/NextLanguage for
    more information on the configuration of this log file.

    Initializing NextLanguage:

        Loaded Configuration File: ./config.nxconf
        Loaded .nxl File: ${nxlf}

        Building ID Patches:

            Detected Directory: ./build/patches
            Created Directory: ./build/export

        Ended ID Patches Build
        
        Packaging ID:

            Created Directory: ./build/package/id
            Created Directory Listings:

                ./build/package/id/dev
                ./build/package/id/type
                ./build/package/id/versions

            Completed Directory Listings
            
            Loaded Development Configuration File: ./build/package/id/dev/config.dev_nxa
            Loaded Type Configuration File: ./build/package/id/type/computer_language.core_nxa
            Loaded Version Configuration File: ./build/package/id/versions/v1.7.core_nxa
            Loaded Building File: ./build/package/buildData.js
            
            Written to: build-id.json

        Packaged ID
        
        Packaging Modules:

            Detected Directory: ./modules
            
            Loaded Module: ./modules/githubLatestBuild.js
            Loaded Module: ./modules/openWebWindow.js
            Loaded Module: ./modules/path-ifFileExists.js
            Loaded Module: ./modules/openNormalWindow.js
            
        Packaged Modules
        
        Installing Dependencies:

            Dependencies:

                fetch,
                fiddle, 
                fs,
                http,
                path,
                querystring,
                url,

            end(Dependencies)

            devDependencies:

                capture-console,
                date-and-time,
                electron,

            end(devDependencies)

        Installed Dependencies

        Generating Project Files:

            Generated Root File: app.nxl
            Generated Root File: config.nxconf
            Generated Root File: enable.bat
            Generated Root File: init.js

        Generated Project Files

    Initialized NextLanguage
            ` + `

    < ---------------------------------------------------------------- >

    Log File: ./build/lib/log/${currenttime}-NXL_Startup.log

`, 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
})