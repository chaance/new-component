const os = require("os");
const path = require("path");
const { mkdir } = require("fs-extra");
const prettier = require("prettier");
const chalk = require("chalk");
const { requireOptional, directoryExists, rainbowize } = require("./utils");
const { choices, defaults } = require("./constants");

/**
 * @param {string} componentName
 * @param {{ index: boolean; dir: string }} options
 */
async function createComponentDirectory(componentName, options) {
	try {
		const fullPathToComponentDir = getComponentPath(componentName, options);
		if (!(await directoryExists(fullPathToComponentDir))) {
			await mkdir(fullPathToComponentDir, { recursive: true });
			return true;
		}
		return false;
	} catch (err) {
		console.error("Well fuck!");
	}
}

/**
 * @param {string} componentName
 * @param {{ index: boolean; dir: string }} options
 */
function getComponentPath(componentName, options) {
	return options.index ? path.resolve(options.dir, componentName) : options.dir;
}

/**
 * Get the configuration for this component. Overrides are as follows:
 *  - default values
 *  - globally-set overrides
 *  - project-specific overrides
 *  - command-line arguments.
 *
 * The CLI args aren't processed here; this config is used when no CLI argument
 * is provided.
 */
function getConfig() {
	const home = os.homedir();
	const currentPath = process.cwd();

	const globalOverrides = requireOptional(
		`/${home}/.new-component-config.json`
	);

	const localOverrides = requireOptional(
		`/${currentPath}/.new-component-config.json`
	);

	return {
		...defaults,
		...globalOverrides,
		...localOverrides,
	};
}

/**
 * @param {*} prettierConfig
 * @param {{ extension: 'js'|'tsx' }} options
 * @returns
 */
function buildPrettifier(prettierConfig, options) {
	return (text) =>
		prettier.format(text, {
			parser: options.extension === "tsx" ? "babel-ts" : "babel",
			...(prettierConfig || {}),
		});
}

/**
 *
 * @param {{ style: string }} options
 * @returns
 */
function hasStyles(options) {
	return options.style.toUpperCase().trim() !== "NONE";
}

function getStyleTemplate(componentName, style) {
	switch (style) {
		case "stylus":
			return `.${componentName}\n`;
		default:
			return `.${componentName} {}\n`;
	}
}

function logType(arr, selected) {
	return arr
		.sort((a) => (a === selected ? -1 : 1))
		.map((option) =>
			option === selected
				? `${chalk.bold.cyan(option)}`
				: `${chalk.blackBright(option)}`
		)
		.join("  ");
}

function logComponentType(selected) {
	return logType(choices.type, selected);
}

function logStyleType(selected) {
	return logType(
		choices.style.filter((s) => s !== "NONE"),
		selected
	);
}

function logExtensionType(selected) {
	return logType(choices.extension, selected);
}

function logIntro({ name, dir, type, style, extension }) {
	console.info("\n");
	console.info(`✨ Creating the ${chalk.bold.yellow(name)} component ✨`);
	console.info("\n");

	const pathString = chalk.bold.cyan(dir);
	const typeString = logComponentType(type);
	const extensionString = logExtensionType(extension);
	const styleString =
		style && style.toUpperCase().trim() !== "NONE" ? logStyleType(style) : null;

	console.info(`Directory:  ${pathString}`);
	console.info(`Type:       ${typeString}`);
	console.info(`Extension:  ${extensionString}`);
	if (styleString) {
		console.info(`Stylesheet: ${styleString}`);
	}
	console.info(chalk.blackBright("========================================="));

	console.info("\n");
}

function logItemCompletion(successText) {
	const checkmark = chalk.greenBright("✓");
	console.info(`${checkmark} ${successText}`);
}

function logConclusion() {
	console.info("\n");
	console.info(chalk.bold.greenBright("Component created! 🚀 "));
	console.info(
		chalk.white(
			`Thanks for using ${chalk.bold(
				rainbowize("@chancedigital/new-component")
			)}!`
		)
	);
	console.info("\n");
}

function logError(error) {
	console.info("\n");
	console.info(chalk.bold.red("Error creating component."));
	console.info(chalk.red(error));
	console.info("\n");
}

module.exports.buildPrettifier = buildPrettifier;
module.exports.createComponentDirectory = createComponentDirectory;
module.exports.getComponentPath = getComponentPath;
module.exports.getConfig = getConfig;
module.exports.getStyleTemplate = getStyleTemplate;
module.exports.hasStyles = hasStyles;
module.exports.logConclusion = logConclusion;
module.exports.logError = logError;
module.exports.logIntro = logIntro;
module.exports.logItemCompletion = logItemCompletion;
