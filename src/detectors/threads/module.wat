;; Name: Threads
;; Proposal: https://github.com/webassembly/threads

(module
  (memory (1 1 shared))
  (func
    (drop
      (i32.atomic.load (i32.const 0)))
  )
)
