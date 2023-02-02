;; Name: Memory64
;; Proposal: https://github.com/WebAssembly/memory64
;; Features: memory64

(module
  ;; The syntax support in wabt is currently buggy/incomplete. This works, tho.
  ;; See https://github.com/WebAssembly/wabt/issues/1532
  (memory i64 1)
)
