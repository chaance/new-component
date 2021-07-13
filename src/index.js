#!/usr/bin/env node
const { writeFile } = require("fs-extra");
const path = require("path");
const { Command, Option } = require("commander");
const {
	buildPrettifier,
	createComponentDirectory,
	getComponentPath,
	getConfig,
	getStyleTemplate,
	hasStyles,
	logConclusion,
	logError,
	logIntro,
	logItemCompletion,
} = require("./helpers");
const { fileExists, directoryExists, readFileRelative } = require("./utils");

run();

async function run() {
	// Get the default config for this component (looks for local/global overrides,
	// falls back to sensible defaults).
	let config = getConfig();
	let { componentName, options } = createProgram(process.argv, config);

	ensureComponentName(componentName);

	// Convenience wrapper around Prettier, so that config doesn't have to be passed
	// every time.
	let prettify = buildPrettifier(config.prettierConfig, options);
	let componentDir = getComponentPath(componentName, options);

	logIntro({
		name: componentName,
		dir: componentDir,
		type: options.type,
		extension: options.extension,
		style: options.style,
	});

	try {
		await ensureNewComponent(componentName, options);
		let { paths, templates } = await prepareProgram(componentName, options);

		// Start by creating the directory that our component lives in
		// (if it doesn't already exist)
		let created = await createComponentDirectory(componentName, options);
		created && logItemCompletion("Component directory created.");

		await writeFile(paths.component, prettify(templates.component), "utf-8");
		logItemCompletion("Component built and saved to disk.");

		if (options.index) {
			await writeFile(paths.index, prettify(templates.index), "utf-8");
			logItemCompletion("Index file built and saved to disk.");
		}

		if (hasStyles(options)) {
			await writeFile(paths.style, templates.style, "utf-8");
			logItemCompletion("Stylesheet file built and saved to disk.");
		}

		logConclusion();
	} catch (err) {
		console.error(err);
	}
}

function createProgram(args, config) {
	// Load our package.json, so that we can pass the version onto `commander`.
	let { version } = require("../package.json");
	let program = new Command();
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
			"-i, --index",
			`Whether or not to index the component in its own sub-directory`,
			config.index
		)
		.option(
			"-d, --dir <pathToDirectory>",
			`Path to the "components" directory`,
			config.dir
		)
		.addOption(
			new Option(
				"-x, --extension <fileExtension>",
				`The file extension to use for the component`
			)
				.choices(["js", "tsx"])
				.default(config.extension)
		)
		.addOption(
			new Option(
				"-s, --style <styleExtension>",
				`The file extension to use for the component's CSS file`
			)
				.choices([
					"css",
					"scss",
					"less",
					"stylus",
					"module.css",
					"module.scss",
					"NONE",
				])
				.default(config.style)
		);

	program.parse(args);

	return {
		componentName: program.args[0],
		options: program.opts(),
	};
}

/**
 * @param {string} componentName
 * @param {{
 *   extension: 'tsx'|'js';
 *   index: boolean;
 *   style: string;
 *   type: 'functional'|'class'|'pure-class'
 * }} options
 * @returns
 */
async function prepareProgram(componentName, options) {
	// Find the path to the selected template file.
	const templatePath = `./templates/${options.type}.${options.extension}`;
	// Get all of our file paths worked out, for the user's project.
	const componentDir = getComponentPath(componentName, options);
	const componentPath = path.resolve(
		componentDir,
		`${componentName}.${options.extension}`
	);
	const indexPath = options.index
		? path.resolve(componentDir, `index.${options.extension}`)
		: null;
	const stylePath = path.resolve(
		componentDir,
		`${componentName}.${options.style}`
	);
	// Our index template is super straightforward, so we'll just inline it for now.
	const indexTemplate = options.index
		? `\nexport { ${componentName} } from './${componentName}';\n`
		: null;

	// Simple stylesheet template.
	const styleTemplate = getStyleTemplate(componentName, options.style);

	let componentTemplate = await readFileRelative(templatePath);

	// Modify style imports as needed
	if (!hasStyles(options)) {
		componentTemplate = componentTemplate.replace(
			'import styles from "./COMPONENT_NAME.STYLE_EXT";',
			""
		);
	} else if (!options.style.includes("module")) {
		componentTemplate = componentTemplate.replace(
			"import styles from",
			"import"
		);
	}

	// Replace component name and style extensions
	componentTemplate = componentTemplate
		.replace(/COMPONENT_NAME/g, componentName)
		.replace(/STYLE_EXT/g, options.style);

	return {
		paths: {
			component: componentPath,
			index: indexPath,
			style: stylePath,
		},
		templates: {
			component: componentTemplate,
			index: indexTemplate,
			style: styleTemplate,
		},
	};
}

/**
 * @param {string} componentName
 * @returns {void}
 */
function ensureComponentName(componentName) {
	// Check if componentName is provided
	if (!componentName) {
		logError(
			`Sorry, you need to specify a name for your component like this: new-component <name>`
		);
		process.exit(0);
	}
}

/**
 * Check to see if this component has already been created
 * @param {*} componentName
 * @param {{ index: boolean; extension: 'js'|'tsx' }} options
 */
async function ensureNewComponent(componentName, options) {
	let componentDir = getComponentPath(componentName, options);
	let exists = await (options.index
		? directoryExists(componentDir)
		: fileExists(
				path.resolve(componentDir, `${componentName}.${options.extension}`)
		  ));

	if (exists) {
		logError(
			`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete it and try again if you believe this is a mistake.`
		);
		process.exit(0);
	}
}
