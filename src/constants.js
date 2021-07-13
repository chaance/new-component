module.exports = {
	choices: {
		/** @type {["functional", "class", "pure-class", "forward-ref"]} */
		type: ["functional", "class", "pure-class", "forward-ref"],

		/** @type {["js", "tsx"]} */
		extension: ["js", "tsx"],

		/** @type {["css", "scss", "less", "stylus", "module.css", "module.scss", "NONE"]} */
		style: [
			"css",
			"scss",
			"less",
			"stylus",
			"module.css",
			"module.scss",
			"NONE",
		],
	},

	defaults: {
		/** @type {"functional"} */
		type: "functional",
		/** @type {"src/components"} */
		dir: "src/components",
		/** @type {"js"} */
		extension: "js",
		/** @type {"css"} */
		style: "css",
		/** @type {false} */
		index: false,
	},
};
