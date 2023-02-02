;; Name: Garbage Collection
;; Proposal: https://github.com/WebAssembly/gc

(module
	(type $tuple (struct (field $id f32)))
	(func (result (ref $tuple))
		(struct.new $tuple (f32.const 0)))
)
