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
