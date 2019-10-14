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

const assert = require('assert');

process.on("unhandledRejection", err => {
  throw err;
});

// We try to import the generated module
const features = require(__dirname+'/../dist/cjs');

const isBoolean = function (value) {
  return typeof value === 'boolean';
}

const checkFeature = async function (featureName) {
  const feature = features[featureName];
  assert(feature, `The feature ${featureName} doesn't exist`);
  const result = await feature();
  console.log(`The feature ${featureName} returned: ${result}`);
  assert(isBoolean(result), `The feature ${featureName} returned: ${result}`);
}

async function run() {
  await checkFeature("bulkMemory");
  await checkFeature("exceptions");
  await checkFeature("multiValue");
  await checkFeature("mutableGlobals");
  await checkFeature("referenceTypes");
  await checkFeature("saturatedFloatToInt");
  await checkFeature("signExtensions");
  await checkFeature("simd");
  await checkFeature("tailCall");
  await checkFeature("threads");
  await checkFeature("bigintParameters");
}

run();
