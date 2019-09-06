// This function only exists because `WebAssembly.compile` will
// be called quite often and by having our own function terser can give it
// a one-letter name.
export function testCompile(path) {
  return WebAssembly.compile(path);
}
