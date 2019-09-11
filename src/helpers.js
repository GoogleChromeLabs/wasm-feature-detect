/**
 * Copyright 2019 Google Inc. All Rights Reserved.
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

function decodeBase64(b64) {
  try {
    return Buffer.from(b64, "base64");
  } catch {
    const byteString = atob(data);
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      buffer[i] = byteString.charCodeAt(i);
    }
    return buffer;
  }
}

// This function only exists because `WebAssembly.compile` will
// be called quite often and by having our own function terser can give it
// a one-letter name.
export async function testCompile(data) {
  try {
    await WebAssembly.compile(decodeBase64(data));
    return true;
  } catch (e) {
    return false;
  }
}
