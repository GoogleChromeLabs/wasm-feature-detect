;; Name: Sign-extension operators
;; Proposal: https://github.com/WebAssembly/sign-extension-ops
;; Features: sign_extension

(module
  (func
    i32.const 0
    i32.extend8_s
    drop
  )
)
