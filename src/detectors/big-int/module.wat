;; Name: BigInt integration
;; Proposal: https://github.com/WebAssembly/JS-BigInt-integration

(module
  (func (export "b") (param i64) (result i64)
    local.get 0
  )
)
