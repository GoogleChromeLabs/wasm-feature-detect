;; Name: Sign-extension operators
;; Proposal: https://github.com/WebAssembly/sign-extension-ops
;; Flags: --enable-sign-extension

(module
  (func
    i32.const 0
    i32.extend8_s
    drop
  )
)
