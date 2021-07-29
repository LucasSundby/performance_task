module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended'
    ],
    rules: {
        'semi': 2,
        'indent': ['warn', 4]
    },
    ignorePatterns: [
        '*.config.js',
    ],
};

