var Metric = require('./helperFunctions').Metric;
var metrics = {}


module.exports.createMetric = function (request, response) {
  var metricName = request.body.metricName;
  if (!metrics[metricName]) {
    metrics[metricName] = new Metric(metricName);
    response.status(200).json(metrics[metricName]);
  } else {
    response.status(200).json({err: 'metric already exist'});
  }
}
module.exports.reset = function (request, response) {
  metrics = {};
  response.status(200).json({'alert': 'memory is empty'});

}

module.exports.postValues = function (request, response) {
  var metricName = request.body.metricName;
  var value = request.body.value;
  if (metrics[metricName]) {
    metrics[metricName].insert({value: value});
    response.status(200).send({
      sizeOfMetric: metrics[metricName].size()
    });
  } else {
    metrics[metricName] = new Metric(metricName);
    metrics[metricName].insert({value: value});
    response.status(200).send({
      'sizeOfMetric': metrics[metricName].size(),
      'alert': 'metric does not exist, created new metric automatically'
    });
  }
}

module.exports.retrieveStatistics = function (request, response) {
  var metricName = request.body.metricName;
  console.log(metrics[metricName]);
  if (!metrics[metricName]) {
    metrics[metricName] = new Metric(metricName);
    response.status(200).send({err: 'metric name does not exist'})
  } 
  response.status(200).send({
    arithmeticMean: metrics[metricName].average(),
    median: metrics[metricName].median(),
    min: metrics[metricName].min(),
    max: metrics[metricName].max()
  })
}