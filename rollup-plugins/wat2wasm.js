import { compileWat } from "./helpers.js";

const PREFIX = "wat2wasm:";

export default function() {
  return {
    async resolveId(id, importer) {
      if (!id.startsWith(PREFIX)) {
        return;
      }
      const unresolvedPath = id.substr(PREFIX.length);
      const { id: path } = await this.resolve(unresolvedPath, importer);
      return PREFIX + path;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return;
      }
      const path = id.substr(PREFIX.length);
      const module = await compileWat(path, ["--enable-simd"]);
      return `export default "data:application/wasm;base64,${module.toString(
        "base64"
      )}";`;
    }
  };
}
