// This function only exists because `WebAssembly.compile` will
// be called quite often and by having our own function terser can give it
// a one-letter name.
export async function testCompile(path) {
  return WebAssembly.compile(await fetch(path).then(r => r.arrayBuffer()));
}
