// lint-staged.config.js
module.exports = {
	// Type check TypeScript files in the client folder
	'demo/**/*.(ts|tsx)': () => 'npx tsc --noEmit -p demo/tsconfig.json',

	// Lint then format TypeScript and JavaScript files in the client folder
	'demo/**/*.(ts|tsx|js)': (filenames) => [
		`npx eslint --fix ${filenames.join(' ')} --config .eslintrc.json`,
		`npx prettier --write ${filenames.join(' ')}`,
	],

	// Type check TypeScript files in the client folder
	'package/**/*.(ts|tsx)': () => 'npx tsc --noEmit -p package/tsconfig.json',

	// Lint then format TypeScript and JavaScript files in the client folder
	'package/**/*.(ts|tsx|js)': (filenames) => [
		`npx eslint --fix ${filenames.join(' ')} --config .eslintrc.json`,
		`npx prettier --write ${filenames.join(' ')}`,
	],

	// Format MarkDown and JSON
	'**/*.(md|json)': (filenames) =>
		`npx prettier --write ${filenames.join(' ')}`,
};
