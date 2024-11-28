module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            presets: ['@babel/preset-react'],
        },
    },
    plugins: ['@babel'],
    extends: [
        'eslint:recommended',
        'plugin:@babel/recommended',
        'plugin:react/recommended',
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        // Your custom rules
    },
};
