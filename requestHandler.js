var Metric = require('./helperFunctions').Metric;
var metrics = {}


module.exports.createMetric = function (request, response) {
  var metricName = request.body.metricName;
  metrics[metricName] = new Metric(metricName)
  response.status(200).send('metricName');

}

module.exports.createMetric = function (request, response) {
  var metricName = request.body.metricName;
  var value = request.body.value;
  if (metrics[metricName]) {
    metrics[metricName].insert(value);
    response.status(200).send(value);
  }
}