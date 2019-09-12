# WebAssembly Feature Detection

A small library (~550B gzip’d) to detect which features of WebAssembly are supported in your current browser.

## Installation

```
npm install -g wasm-feature-detect
```

## Usage

```html
<script type="module">
  import { simd } from "https://unpkg.com/wasm-feature-detect?module";

  simd().then(simdSupported => {
    if (simdSupported) {
      /* SIMD support */
    } else {
      /* No SIMD support */
    }
  });
</script>
```

If required, there’s also a UMD version

```html
<script src="https://unpkg.com/wasm-feature-detect/dist/umd/index.js"></script>
<script>
  wasmFeatureDetect.simd().then(/* same as above */);
</script>
```

## Detectors

All detectors return a `Promise<bool>`.

| Function                | Proposal                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `bulkMemory()`          | [Bulk memory operations](https://github.com/webassembly/bulk-memory-operations)                              |
| `exceptions()`          | [Exception handling](https://github.com/WebAssembly/exception-handling)                                      |
| `multiValue()`          | [Multi-value](https://github.com/WebAssembly/multi-value)                                                    |
| `mutableGlobals()`      | [Importable/Exportable mutable globals]()                                                                    |
| `referenceTypes()`      | [Reference Types](https://github.com/WebAssembly/reference-types)                                            |
| `saturatedFloatToInt()` | [Non-trapping float-to-int conversions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions) |
| `signExtensions()`      | [Sign-extension operators](https://github.com/WebAssembly/sign-extension-ops)                                |
| `simd()`                | [Fixed-Width SIMD](https://github.com/webassembly/simd)                                                      |
| `tailCall()`            | [Tail call](https://github.com/webassembly/tail-call)                                                        |
| `threads()`             | [Threads](https://github.com/webassembly/threads)                                                            |

## Why are all the tests async?

The _technical_ reason is that some tests might have to be augmented to be asynchronous in the future. For example, Firefox is planning to [make a change][ff coop] that would require a `postMessage` call to detect SABs, which are required for threads.

The _other_ reason is that you _should_ be using `WebAssembly.compile`, `WebAssembly.instantiate`, or their streaming versions `WebAssembly.compileStreaming` and `WebAssembly.instantiateStreaming`, which are all asynchronous. You should already be prepared for asynchronous code when using WebAssembly!

[ff coop]: https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ

---

License Apache-2.0
