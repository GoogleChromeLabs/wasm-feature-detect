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

import { terser } from "rollup-plugin-terser";

import indexGenerator from "./rollup-plugins/index-generator.js";
import wasm2wat from "./rollup-plugins/wat2wasm.js";

export default ["esm", "cjs", "umd"].map(format => ({
  input: "./src/index.js",
  output: {
    dir: `dist/${format}`,
    format,
    name: "wasmFeatureDetect"
  },
  plugins: [
    indexGenerator({ indexPath: "./src/index.js", pluginFolder: "detectors" }),
    wasm2wat(),
    terser({
      ecma: 8,
      compress: true,
      mangle: {
        toplevel: true
      }
    })
  ]
}));
