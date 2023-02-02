;; Name: Bulk memory operations
;; Proposal: https://github.com/webassembly/bulk-memory-operations

(module
  (memory 1)
  (func
    i32.const 0
    i32.const 0
    i32.const 0
    memory.copy
  )
)
