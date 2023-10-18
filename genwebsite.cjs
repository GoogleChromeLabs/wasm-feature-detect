const hljs = require("highlight.js");
const md = require("markdown-it")({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(str, { language: lang }).value;
			} catch (err) {
				console.err("Highlighting failed:", err);
			}
		}

		return ""; // use external default escaping
	},
});
const ejs = require("ejs");
const fsp = require("fs").promises;

async function init() {
	const readmeSrc = await fsp.readFile("./README.md", "utf8");
	const readme = md.render(readmeSrc);

	await fsp.mkdir("website").catch((e) => {});
	await fsp.copyFile("./dist/esm/index.js", "./website/wasm-feature-detect.js");
	await fsp.copyFile(
		"./node_modules/highlight.js/styles/github.css",
		"./website/syntax.css",
	);

	const template = await fsp.readFile("./website.ejs", "utf8");
	const output = ejs.render(template, { readme });
	await fsp.writeFile("./website/index.html", output);
}

init();
