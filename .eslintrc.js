module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		semi: ['warn', 'never'],
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				semi: false,
				singleQuote: true,
				quoteProps: 'as-needed',
				trailingComma: 'all',
			},
		],
	},
	parserOptions: {
		parser: '@typescript-eslint/parser',
	},
	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)'],
			env: {
				mocha: true,
			},
		},
	],
}
