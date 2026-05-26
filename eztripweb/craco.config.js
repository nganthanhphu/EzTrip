const path = require('path');

module.exports = {
webpack: {
    alias: {
    '@components': path.resolve(__dirname, 'src/components'),
    '@layouts': path.resolve(__dirname, 'src/layouts'),
    '@screens': path.resolve(__dirname, 'src/screens'),
    '@utils': path.resolve(__dirname, 'src/utils')
    }
}
};
