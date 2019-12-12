/**
*  Copyright 2019 IBM Corp. All Rights Reserved.

*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

async function main(params) {
  const visualRecognition = new VisualRecognitionV3({
    version: params.version,
    iam_apikey: params.apikey,
  });
  try {
    const { body, bucket } = params;
    let { key } = params;

    const classifyParams = {
      url: body,
      threshold: 0.6,
    };
    let vrClasses;

    await visualRecognition.classify(classifyParams)
      .then((classifiedImages) => {
        vrClasses = classifiedImages.images[0].classifiers[0].classes;
      }).catch((err) => {
        console.log('error:', err);
      });
    const filename = key;

    const n = key.lastIndexOf('.');
    key = key.substring(0, n !== -1 ? n : key.length);
    const returnJSON = {
      id: filename,
      classes: vrClasses,
    };

    return {
      bucket: `${bucket}-processed`,
      key: `${key}_vr.json`,
      body: JSON.stringify(returnJSON),
    };
  } catch (err) {
    console.log(err);
    return Promise.reject({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: err.message },
    });
  }
}
 
 exports.main = main;
 