/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
  const {
    apiKey, instance_crn, resultset_target, statement,
  } = params;
  return {
    apiKey, instance_crn, resultset_target, statement,
  };
}
