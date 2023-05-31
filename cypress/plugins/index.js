const wp = require('@cypress/webpack-preprocessor');
const task = require('cypress-skip-and-only-ui/task');

module.exports = on => {
    const options = {
        webpackOptions: require('../webpack.config'),
    };
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push(
                '--disable-blink-features=RootLayerScrolling'
            );
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--proxy-bypass-list=<-loopback>');
            return launchOptions;
        }
    });
    on('file:preprocessor', wp(options));

    on('task', task);
};
