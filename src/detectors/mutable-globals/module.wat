;; Name: Importable/Exportable mutable globals

(module
  (import "a" "b" (global (mut i32)))
  (global (export "a") (mut i32) (i32.const 0))
)
