;; Name: Threads
;; Proposal: https://github.com/webassembly/threads
;; Flags: --enable-threads

(module
  (memory 1 1 shared)
  (func
    i32.const 0
    i32.atomic.load
    drop
  )
)
