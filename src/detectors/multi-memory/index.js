/**
 * Copyright 2023 Google Inc. All Rights Reserved.
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
;; Name: Multiple Memories
;; Proposal: https://github.com/WebAssembly/multi-memory
;; Features: multi-memory
*/

export default async () => {
	try {
		new WebAssembly.Module(
			// prettier-ignore
			new Uint8Array([
				// magic number
				0x00, 0x61, 0x73, 0x6d,
				0x01, 0x00, 0x00, 0x00,
				0x05, // memory section id
				0x05, // section length
				0x02, // 2 memories
				0x00, 0x00, // 1st has no max, min of 0
				0x00, 0x00, // 2nd has no max, min of 0
			]),
		);
		return true;
	} catch (e) {
		return false;
	}
};
