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
import { dirname, join } from "path";

import { compileWat, fileExists, camelCaseify } from "./helpers.mjs";

export default function({ indexPath, pluginFolder, format, env }) {
  const rootPluginPath = join(dirname(indexPath), pluginFolder);
  return {
    resolveId(id) {
      if (id === indexPath) {
        return id;
      }
    },
    async load(id) {
      if (id !== indexPath) {
        return;
      }

      const plugins = await fsp.readdir(rootPluginPath);

      const sources = await Promise.all(
        plugins.map(async plugin => {
          const source = await fsp.readFile(
            `./src/${pluginFolder}/${plugin}/module.wat`,
            "utf8"
          );
          const features = (/;;\s*Features:\s*(.+)$/im.exec(source) || [
            "",
            ""
          ])[1].split(" ");
          const moduleBytes = JSON.stringify([
            ...(await compileWat(
              `./src/${pluginFolder}/${plugin}/module.wat`,
              features
            ))
          ]);
          const pluginName = camelCaseify(plugin);
          // Only threads has a separate implementation for browser and nodejs.
          const fileName =
            plugin == "threads"
              ? `${pluginFolder}/${plugin}/index-${env}.js`
              : `${pluginFolder}/${plugin}/index.js`;
          if (await fileExists(`./src/${fileName}`)) {
            const importName = `${pluginName}_internal`;
            return {
              import: `import ${importName} from "./${fileName}";`,
              exportName: pluginName,
              exportValue: `() => ${importName}(new Uint8Array(${moduleBytes}))`
            };
          } else {
            return {
              exportName: pluginName,
              exportValue: `async () => WebAssembly.validate(new Uint8Array(${moduleBytes}))`
            };
          }
        })
      );

      if (format === "esm") {
        // For ESM, just use a single `export const`.
        exports = `export const ${sources
          .map(s => `${s.exportName} = ${s.exportValue}`)
          .join(",")}`;
      } else {
        // For CJS / UMD it's more optimal size-wise to export everything as a single object.
        exports = `export default {${sources
          .map(s => `${s.exportName}: ${s.exportValue}`)
          .join(",")}}`;
      }

      return `
      ${sources
        .map(s => s.import)
        .filter(Boolean)
        .join("\n")}
      ${exports}
      `;
    }
  };
}
