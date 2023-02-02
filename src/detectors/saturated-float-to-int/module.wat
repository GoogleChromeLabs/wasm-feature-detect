;; Name: Non-trapping float-to-int conversions
;; Proposal: https://github.com/WebAssembly/nontrapping-float-to-int-conversions

(module
  (func
    f32.const 0
    i32.trunc_sat_f32_s
    drop
  )
)
