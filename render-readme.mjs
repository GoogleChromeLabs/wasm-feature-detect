/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ejs from "ejs";
import { promises as fsp } from "fs";
import { gzipSync } from "zlib";

import { fileExists, plugins } from "./rollup-plugins/helpers.mjs";

async function run() {
	let detectors = await Promise.all(
		plugins.map(async ({ path, name: func }) => {
			let index;
			if (await fileExists(`${path}/module.wat`)) {
				index = await fsp.readFile(`${path}/module.wat`, "utf8");
			} else if (await fileExists(`${path}/module.wast`)) {
				index = await fsp.readFile(`${path}/module.wast`, "utf8");
			} else {
				index = await fsp.readFile(`${path}/index.js`, "utf8");
			}
			const name = (/;;\s*Name:\s*(.+)$/im.exec(index) || ["", ""])[1];
			const proposal = (/;;\s*Proposal:\s*(.+)$/im.exec(index) || ["", ""])[1];
			return { name, proposal, func };
		})
	);
	const lib = await fsp.readFile("./dist/esm/index.js");
	const gzippedLib = gzipSync(lib, { level: 9 });
	const readme = await ejs.renderFile("./README.md.ejs", {
		gzippedSize: Math.round(gzippedLib.length / 10) * 10,
		detectors,
	});
	await fsp.writeFile("./README.md", readme);
}
run().catch((err) => console.error(err));
