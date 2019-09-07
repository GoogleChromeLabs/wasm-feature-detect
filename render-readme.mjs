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

import { camelCaseify } from "./rollup-plugins/helpers.mjs";

async function run() {
  let detectors = await fsp.readdir("./src/detectors");
  detectors = await Promise.all(
    detectors.map(async detector => {
      const index = await fsp.readFile(
        `./src/detectors/${detector}/index.js`,
        "utf8"
      );
      const name = (/\/\/\s*Name:\s*(.+)$/im.exec(index) || ["", ""])[1];
      const proposal = (/\/\/\s*Proposal:\s*(.+)$/im.exec(index) || [
        "",
        ""
      ])[1];
      return { name, proposal, func: camelCaseify(detector) };
    })
  );
  const readme = await ejs.renderFile("./README.md.ejs", { detectors });
  await fsp.writeFile("./README.md", readme);
}
run().catch(err => console.error(err));
