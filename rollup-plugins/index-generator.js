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

import { promises as fsp } from "fs";

import { compileWat, compileWast, fileExists, plugins } from "./helpers.mjs";

export default function ({ indexPath, format }) {
	return {
		name: "index-generator",
		resolveId(id) {
			if (id === indexPath) {
				return id;
			}
		},
		async load(id) {
			if (id !== indexPath) {
				return;
			}

			const sources = await Promise.all(
				plugins.map(async ({ path, name }) => {
					let moduleBytes = "";
					if (await fileExists(`${path}/module.wat`)) {
						const source = await fsp.readFile(`${path}/module.wat`, "utf8");
						const features = (/;;\s*Features:\s*(.+)$/im.exec(source) || [
							"",
							"",
						])[1].split(" ");
						const moduleBuffer = await compileWat(
							`${path}/module.wat`,
							features,
						);
						moduleBytes = JSON.stringify([...moduleBuffer]);
					} else if (await fileExists(`${path}/module.wast`)) {
						const moduleBuffer = await compileWast(`${path}/module.wast`);
						moduleBytes = JSON.stringify([...moduleBuffer]);
					}
					if (await fileExists(`${path}/index.js`)) {
						const importName = `${name}_internal`;
						return {
							import: `import ${importName} from ${JSON.stringify(
								`${path}/index.js`,
							)};`,
							exportName: name,
							exportValue: `() => ${importName}(new Uint8Array(${moduleBytes}))`,
						};
					} else {
						return {
							exportName: name,
							exportValue: `async () => WebAssembly.validate(new Uint8Array(${moduleBytes}))`,
						};
					}
				}),
			);

			let exports;
			if (format === "esm") {
				// For ESM, just use a single `export const`.
				exports = `export const ${sources
					.map((s) => `${s.exportName} = ${s.exportValue}`)
					.join(",")}`;
			} else {
				// For CJS / UMD it's more optimal size-wise to export everything as a single object.
				exports = `export default {${sources
					.map((s) => `${s.exportName}: ${s.exportValue}`)
					.join(",")}}`;
			}

			return `
      ${sources
				.map((s) => s.import)
				.filter(Boolean)
				.join("\n")}
      ${exports}
      `;
		},
	};
}
