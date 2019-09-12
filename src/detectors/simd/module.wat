;; Name: Fixed-Width SIMD
;; Proposal: https://github.com/webassembly/simd
;; Flags: --enable-simd

(module
  (func
    i32.const 0
    i8x16.splat
    drop
  )
)
