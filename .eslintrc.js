module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'indent': [
            'error',
            2,
            { 'SwitchCase': 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single',
            { 'allowTemplateLiterals': true }
        ],
        'semi': [
            'error',
            'always'
        ],
        'eol-last': [ 'error', 'always' ],
        'eqeqeq': [ 'error', 'always' ],
        'spaced-comment': [ 'error', 'always', { 'markers': [ '/' ] } ],
        'block-spacing': [ 'error', 'always' ],
        'no-whitespace-before-property': [ 'error' ],
        'no-trailing-spaces': [ 'error' ],
        'no-unused-vars': [ 'off' ],
        'brace-style': 'off',
        '@typescript-eslint/type-annotation-spacing': [ 'error', {
            before: false,
            after: true,
            overrides: { arrow: { before: true, after: true } }
        } ],
        '@typescript-eslint/brace-style': [ 'error' ],
        '@typescript-eslint/explicit-function-return-type': [ 'error' ],
    },
    ignorePatterns: [
        '*.js'
    ]
};
