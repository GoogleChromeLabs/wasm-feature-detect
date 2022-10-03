;; Name: Extented Const Expressesions
;; Proposal: https://github.com/WebAssembly/extended-const
;; Features: extended_const

(module
  (memory 1)
  (data (i32.add (i32.const 1) (i32.const 2)))
)
