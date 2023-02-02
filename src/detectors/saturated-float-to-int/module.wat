;; Name: Non-trapping float-to-int conversions
;; Proposal: https://github.com/WebAssembly/nontrapping-float-to-int-conversions

(module
  (func
    (drop
      (i32.trunc_sat_f32_s
        (f32.const 0)))
  )
)
