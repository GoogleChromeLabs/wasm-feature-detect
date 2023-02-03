import { gzipSync } from "zlib";

export default function sizePrinter() {
	return {
		name: "size-printer",
		renderChunk(rawSource, chunk, outputOptions) {
			const buffer = Buffer.from(rawSource + "\n");
			const gzipped = gzipSync(buffer, { level: 9 });
			console.log("gzipped size:", gzipped.length);
			console.log("raw size:", buffer.length);
		},
	};
}
