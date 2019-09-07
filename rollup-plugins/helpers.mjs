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

import { exec } from "child_process";
import { promisify } from "util";

const execP = promisify(exec);

export async function compileWat(watPath, flags = []) {
  const { stdout } = await execP(`wat2wasm -d ${flags.join(" ")} ${watPath}`);
  const hex = stdout
    .split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split(":")[1].replace(/\s+/g, ""))
    .join("");
  return Buffer.from(hex, "hex");
}

export function camelCaseify(name) {
  return name.replace(/-\w/g, val => val.slice(1).toUpperCase());
}
