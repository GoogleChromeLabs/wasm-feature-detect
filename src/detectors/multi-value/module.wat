;; Name: Multi-value
;; Proposal: https://github.com/WebAssembly/multi-value

(module
  (func (result i32 i32)
    (tuple.make
      (i32.const 0)
      (i32.const 0))
  )
)
