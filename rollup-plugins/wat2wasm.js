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
      return `export default "data:application/wasm;base64,${module.toString(
        "base64"
      )}";`;
    }
  };
}
