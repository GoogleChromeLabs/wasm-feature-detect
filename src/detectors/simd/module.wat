;; Name: Fixed-Width SIMD
;; Proposal: https://github.com/webassembly/simd

(module
  (func (result v128)
    i32.const 0
    i8x16.splat
    i8x16.popcnt
  )
)
