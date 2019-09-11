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

import { compileWat } from "./helpers.mjs";

const PREFIX = "wat2wasm:";

export default function() {
  return {
    async resolveId(id, importer) {
      if (!id.startsWith(PREFIX)) {
        return;
      }
      const [, flags, unresolvedPath] = id.split(":", 3);
      const { id: path } = await this.resolve(unresolvedPath, importer);
      return PREFIX + [flags, path].join(":");
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return;
      }
      const [, flags, path] = id.split(":", 3);
      const module = await compileWat(path, [flags]);
      return `export default "${module.toString("base64")}";`;
    }
  };
}
