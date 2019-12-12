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
const openwhisk = require('openwhisk'); 

async function main(params) {
  const namespace = process.env.__OW_NAMESPACE;
  const results = await (getResults(params, namespace, 4));
  return { message: results };
}

function getResults(theparams, thenamespace, n) {
  console.log("CURRENT N VALUE IS", n)
  const sqlResults = `/${thenamespace}/openwhisk-sql-query/sql-job-resultset`;
  const ignoreCerts = false;
  const ow = openwhisk({ ignoreCerts });
  return new Promise((resolve, reject) => {
    const blocking = true;
    const result = true;
    ow.actions.invoke({actionName: sqlResults, blocking, result, params: theparams,
    }).then((res) => {
      resolve(res);
    }).catch(async (error) => {
      if (n === 1) return reject(error);
      await sleep(5000);
      resolve(getResults(theparams, thenamespace, n - 1));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}