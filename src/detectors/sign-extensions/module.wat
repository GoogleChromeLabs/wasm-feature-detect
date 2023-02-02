;; Name: Sign-extension operators
;; Proposal: https://github.com/WebAssembly/sign-extension-ops

(module
  (func
    (drop
      (i32.extend8_s (i32.const 0)))
  )
)
