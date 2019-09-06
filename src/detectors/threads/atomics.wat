(module
  (type (func))
  (memory 1 1 shared)
  (func (type 0)
    i32.const 0
    i32.atomic.load
    drop
  )
)