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

export default function({ indexPath, pluginFolder }) {
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
      const base64s = [];
      const sources = await Promise.all(
        plugins.map(async plugin => {
          const source = await fsp.readFile(
            `./src/${pluginFolder}/${plugin}/module.wat`,
            "utf8"
          );
          const flags = (/;;\s*Flags:\s*(.+)$/im.exec(source) || [
            "",
            ""
          ])[1].split(" ");
          const module = await compileWat(
            `./src/${pluginFolder}/${plugin}/module.wat`,
            flags
          );
          const base64index = base64s.length;
          base64s.push(module.toString("hex"));
          if (await fileExists(`./src/${pluginFolder}/${plugin}/index.js`)) {
            return `
            import { default as ${camelCaseify(
              plugin
            )}_internal } from "./${pluginFolder}/${plugin}/index.js";
            export async function ${camelCaseify(plugin)}() {
              return (await validate(${base64index}))
                && (await ${camelCaseify(plugin)}_internal());
            }
            `;
          }
          return `
          export const ${camelCaseify(
            plugin
          )} = validate.bind(null, ${base64index});
          `;
        })
      );

      return `
      import { data, validate } from './helpers.js';
      // FIXME: data obj is only needed because separate files can't
      // share globals when stuck together here.
      data.wasms = [${base64s.map(b => `"${b}"`).join(", ")}];
      ${sources.join("\n")}
      `;
    }
  };
}
