/**
*
* main() will be run when you invoke this action
*
* @param Cloud Functions actions accept a single parameter, which must be a JSON object.
*
* @return The output of this action, which must be a JSON object.
*
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