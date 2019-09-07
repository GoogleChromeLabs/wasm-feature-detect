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
