function patches_main() {
    require('./patches/v1.8/configuration.js');
    require('./patches/v1.8/initializer.js');
    require('./patches/v1.8/returns.js');
}

patches_main();