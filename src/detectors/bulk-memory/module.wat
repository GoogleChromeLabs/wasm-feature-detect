;; Name: Bulk memory operations
;; Proposal: https://github.com/webassembly/bulk-memory-operations

(module
  (memory 1)
  (func
    (memory.copy
      (i32.const 0)
      (i32.const 0)
      (i32.const 0))
  )
)
