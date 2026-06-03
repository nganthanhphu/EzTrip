const path = require('path');

module.exports = {
webpack: {
        alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@configs': path.resolve(__dirname, 'src/configs'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@reducers': path.resolve(__dirname, 'src/reducers'),
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@screens': path.resolve(__dirname, 'src/screens'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils')
        }
}
};
