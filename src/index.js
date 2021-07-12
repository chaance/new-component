#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { Command, Option } = require("commander");
const {
	getConfig,
	getStyleTemplate,
	buildPrettifier,
	logIntro,
	logItemCompletion,
	logConclusion,
	logError,
} = require("./helpers");
const {
	mkDirPromise,
	readFilePromiseRelative,
	writeFilePromise,
} = require("./utils");

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require("../package.json");

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be passed
// every time.
const prettify = buildPrettifier(config.prettierConfig);

const program = new Command();

program
	.version(version)
	.argument("<componentName>")
	.addOption(
		new Option(
			"-t, --type <componentType>",
			`Type of React component to generate`
		)
			.choices(["class", "pure-class", "functional"])
			.default(config.type)
	)
	.option(
		"-d, --dir <pathToDirectory>",
		`Path to the "components" directory`,
		config.dir
	)
	.option(
		"-x, --extension <fileExtension>",
		`Which file extension to use for the component`,
		config.extension
	)
	.addOption(
		new Option(
			"-s, --style <styleExtension>",
			`Which file extension to use for the component's CSS files`
		)
			.choices(["css", "scss", "less", "stylus", "module.css", "module.scss"])
			.default(config.style)
	);

program.parse(process.argv);

//.parse(process.argv);

const [componentName] = program.args;
const options = program.opts();

// Find the path to the selected template file.
const templatePath = `./templates/${options.type}.js`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${options.dir}/${componentName}`;
const filePath = `${componentDir}/${componentName}.${options.extension}`;
const indexPath = `${componentDir}/index.js`;
const stylePath = `${componentDir}/${componentName}.${options.style}`;

// Our index template is super straightforward, so we'll just inline it for now.
const indexTemplate = prettify(`\
export { default } from './${componentName}';
`);

// Simple stylesheet template.
const styleTemplate = getStyleTemplate(componentName, options.style);

logIntro({
	name: componentName,
	dir: componentDir,
	type: options.type,
	style: options.style,
});

// Check if componentName is provided
if (!componentName) {
	logError(
		`Sorry, you need to specify a name for your component like this: new-component <name>`
	);
	process.exit(0);
}

// Check to see if a directory at the given path exists
const fullPathToParentDir = path.resolve(options.dir);
if (!fs.existsSync(fullPathToParentDir)) {
	logError(
		`Sorry, you need to create a parent "components" directory.\n(new-component is looking for a directory at ${options.dir}).`
	);
	process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
	logError(
		`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
	);
	process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
	.then(() => readFilePromiseRelative(templatePath))
	.then((template) => {
		logItemCompletion("Directory created.");
		return template;
	})
	.then((template) => {
		// Replace our placeholders with real data (so far, just the component name)
		if (!options.style.includes("module")) {
			template = template.replace("import styles from", "import");
		}
		return template
			.replace(/COMPONENT_NAME/g, componentName)
			.replace(/STYLE_EXT/g, options.style);
	})
	.then((template) =>
		// Format it using prettier, to ensure style consistency, and write to file.
		writeFilePromise(filePath, prettify(template))
	)
	.then((template) => {
		logItemCompletion("Component built and saved to disk.");
		return template;
	})
	.then((template) =>
		// We also need the `index.js` file, which allows easy importing.
		writeFilePromise(indexPath, prettify(indexTemplate))
	)
	.then((template) => {
		logItemCompletion("Index file built and saved to disk.");
		return template;
	})
	.then((template) =>
		// Create the stylesheet.
		writeFilePromise(stylePath, styleTemplate)
	)
	.then((template) => {
		logItemCompletion("Stylesheet file built and saved to disk.");
		return template;
	})
	.then((template) => {
		logConclusion();
	})
	.catch((err) => {
		console.error(err);
	});
