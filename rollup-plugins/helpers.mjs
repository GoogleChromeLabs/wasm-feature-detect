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

import initWabt from "wabt";
import { promises as fsp, readdirSync } from "fs";
import { resolve } from "path";

const wabt = initWabt();

export async function compileWat(watPath, features = []) {
  const watSource = await fsp.readFile(watPath, "utf-8");
  const module = (await wabt).parseWat(
    watPath,
    watSource,
    Object.fromEntries(features.map(flag => [flag, true]))
  );
  return module.toBinary({ canonicalize_lebs: true }).buffer;
}

export async function fileExists(path) {
  try {
    await fsp.stat(path);
    return true;
  } catch {
    return false;
  }
}

const pluginFolder = resolve("src/detectors");

export const plugins = readdirSync(pluginFolder).map(plugin => ({
  path: `${pluginFolder}/${plugin}`,
  name: plugin.replace(/-\w/g, val => val.slice(1).toUpperCase())
}));
