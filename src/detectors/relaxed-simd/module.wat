;; Name: Relaxed SIMD
;; Proposal: https://github.com/webassembly/relaxed-simd

(module
  (func (result v128)
    (i8x16.relaxed_swizzle
      (i8x16.splat (i32.const 1))
      (i8x16.splat (i32.const 2)))
  )
)
