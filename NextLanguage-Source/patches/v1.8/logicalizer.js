const fs = require('fs');
const path = require('path');

const currenttime = require('./clock.js');
const config = require('./contents.js');
const nxlf = fs.readFileSync(config, 'utf8');

fs.writeFileSync('./build/lib/log/' + currenttime + '-NXL_Debug.log', `
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