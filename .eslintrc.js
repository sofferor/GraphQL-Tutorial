module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-use-before-define': ['error', { variables: false, functions: false }],
        'no-shadow': 'off',
        indent: ['error', 4],
    },
};
