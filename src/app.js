async function patches_main() {
    require('./patches/initials.js');
    require('./patches/v1.8/configuration.js');
    require('./patches/v1.8/returns.js');
}

patches_main();