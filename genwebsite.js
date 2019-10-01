const md = require("markdown-it")();
const ejs = require("ejs");
const fsp = require("fs").promises;


async function init() {
  const readmeSrc = await fsp.readFile("./README.md", "utf8");
  const readme = md.render(readmeSrc);

  await fsp.copyFile("./dist/esm/index.js", "./website/wasm-feature-detect.js");

  const template = await fsp.readFile("./website.ejs", "utf8");
  const output = ejs.render(template, {readme});
  await fsp.mkdir("website").catch(e => {});
  await fsp.writeFile("./website/index.html", output);
}

init();