;; Name: Sign-extension operators
;; Proposal: https://github.com/WebAssembly/sign-extension-ops

(module
  (func
    i32.const 0
    i32.extend8_s
    drop
  )
)
