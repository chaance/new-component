const {
	access,
	lstat,
	readFile,
	constants: FS_CONSTANTS,
} = require("fs-extra");
const path = require("path");

/**
 * @param {string} filePath
 * @returns {NodeRequire}
 */
function requireOptional(filePath) {
	try {
		return require(filePath);
	} catch (e) {
		// We want to ignore 'MODULE_NOT_FOUND' errors, since all that means is that
		// the user has not set up a global overrides file. All other errors should
		// be thrown as expected.
		if (e.code !== "MODULE_NOT_FOUND") {
			throw e;
		}
	}
}

/**
 * Somewhat counter-intuitively, `fs.readFile` works relative to the current
 * working directory (if the user is in their own project, it's relative to
 * their project). This is unlike `require()` calls, which are always relative
 * to the code's directory.
 *
 * @param {string} fileLocation
 * @returns {Promise<string>}
 */
async function readFileRelative(fileLocation) {
	return await readFile(path.join(__dirname, fileLocation), "utf-8");
}

/**
 * @param {string} string
 * @returns {Promise<boolean>}
 */
async function isDirectory(path) {
	try {
		return (await lstat(path)).isDirectory();
	} catch (err) {
		return false;
	}
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function fileExists(path) {
	try {
		await access(path, FS_CONSTANTS.F_OK);
		return !(await isDirectory(path));
	} catch (err) {
		return false;
	}
}

/**
 * @param {string} string
 * @returns {Promise<boolean>}
 */
async function directoryExists(path) {
	try {
		await access(path, FS_CONSTANTS.F_OK);
		return await isDirectory(path);
	} catch (err) {
		return false;
	}
}

module.exports.directoryExists = directoryExists;
module.exports.fileExists = fileExists;
module.exports.isDirectory = isDirectory;
module.exports.readFileRelative = readFileRelative;
module.exports.requireOptional = requireOptional;
