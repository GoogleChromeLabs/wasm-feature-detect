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

// This plugin is a workaround for a suboptimal format of Rollup
// exports in ES module mode, where it produces code like:
//
// const A = 1, B = 2, ...;
// export { A, B, ... };
//
// But for optimal size we can inline exports back as:
//
// export const A = 1, B = 2, ...;
//
// For now this plugin expects this specific form of exports
// and isn't meant for general use, but still provides helpful size
// optimisation for this project (~7% gzipped).

import MagicString from "magic-string";
import assert from "assert";

export default function() {
  return {
    name: "export-in-place",

    renderChunk(code) {
      try {
        const ast = this.parse(code);
        // Assert for the AST shape.
        // 1) We should have only two declarations at top level.
        assert.strictEqual(
          ast.body.length,
          2,
          "Bundle should have only two items at the top level."
        );
        const [varDecl, exportDecl] = ast.body;
        // 2) First is a variable declaration (for `const ...`).
        assert.strictEqual(
          varDecl.type,
          "VariableDeclaration",
          "First top-level item should be a variable declaration."
        );
        // 3) Second is a local export list (`export { ... }`).
        assert.strictEqual(
          exportDecl.type,
          "ExportNamedDeclaration",
          "Second top-level item should be an export declaration."
        );
        assert.strictEqual(
          exportDecl.declaration,
          null,
          "Export declaration should contain a list of items."
        );
        assert.strictEqual(
          exportDecl.source,
          null,
          "Export declaration should export local items."
        );
        // 4) Their counts must match.
        assert.strictEqual(
          varDecl.declarations.length,
          exportDecl.specifiers.length,
          "List of exports should contain as many items as there are variables."
        );
        // Now, perform actual transformation - inline exported name back
        // into each variable declarator.
        const output = new MagicString(code);
        const exportMap = new Map(
          exportDecl.specifiers.map(spec => [
            spec.local.name,
            spec.exported.name
          ])
        );
        for (const { id } of varDecl.declarations) {
          const exportedName = exportMap.get(id.name);
          // Make sure we're exporting only declared vars.
          assert(
            exportedName,
            `Export declaration for ${id.name} does not match a local variable.`
          );
          exportMap.delete(id.name);
          output.overwrite(id.start, id.end, exportedName);
        }
        // Finally, prepend `export ` right before `const ...` and return it.
        return `export ${output.slice(varDecl.start, varDecl.end)}`;
      } catch (e) {
        console.warn("Could not inline exports:", e);
        return code;
      }
    }
  };
}
