;; Name: Exception handling
;; Proposal: https://github.com/WebAssembly/exception-handling
;; Flags: --enable-exceptions

(module
  (func
    (try
      (catch
        (drop)
      )
    )
  )
)
