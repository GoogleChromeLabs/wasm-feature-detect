/**
 * Copyright 2026 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
;; Name: Wide Arithmetic
;; Proposal: https://github.com/WebAssembly/wide-arithmetic
;; Features: wide_arithmetic
*/

export default async () =>
	WebAssembly.validate(
		// prettier-ignore
		new Uint8Array([
			// magic number
			0x00, 0x61, 0x73, 0x6d,
			// version
			0x01, 0x00, 0x00, 0x00,
			// type section
			0x01, 0x0a, 0x01, 0x60,
			0x04, 0x7e, 0x7e, 0x7e, 0x7e,
			0x02, 0x7e, 0x7e,
			// function section
			0x03, 0x02, 0x01, 0x00,
			// code section
			0x0a, 0x0e, 0x01, 0x0c,
			// local declarations
			0x00,
			// local.get 0-3
			0x20, 0x00,
			0x20, 0x01,
			0x20, 0x02,
			0x20, 0x03,
			// i64.add128 (0xfc 19)
			0xfc, 0x13,
			// end
			0x0b,
		]),
	);
