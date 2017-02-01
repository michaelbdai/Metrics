var Metric = require('./helperFunctions').Metric;
var metrics = {}

var testInputDataType = function (body) {
  if (body.metricName !== undefined) {
    if (typeof body.metricName !== 'string') {
      return false;
    }
  }
  if (body.value !== undefined) {
    if (typeof body.value !== 'number' && !Array.isArray(body.value)) {
      return false;
    }
    if (Array.isArray(body.value)){
      var correctDataType = body.value.reduce(function(previousResult, element) {
        return previousResult && (typeof element === 'number');
      }, true);
      if (!correctDataType) {
        return false;
      }
    }
  }
  return true;
}
//this is use for middleware
module.exports.checkInputDataType = function (request, response, next) {
  if (testInputDataType(request.body)) {
    next()
  } else {
    response.status(400).send({
      err: 'wrong input data type'
    });   
  }
}
module.exports.createMetric = function (request, response) {
  if (!request.body.metricName) {
    response.status(400).send({
      err: 'missing metricName'
    });
    return;
  }  
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
  if (!request.body.metricName || !request.body.value) {
    response.status(400).send({
      err: 'missing metricName or value'
    });
    return;
  }
  var metricName = request.body.metricName;
  var value = request.body.value;
  if (!metrics[metricName]) {
    metrics[metricName] = new Metric(metricName);
  }
  if (typeof value === 'number') {
    metrics[metricName].insert({value: value});
    response.status(200).send({
      sizeOfMetric: metrics[metricName].size()
    });
  } else if (Array.isArray(value)) {
    value.forEach(function(element) {
      metrics[metricName].insert({value: element});
    })
    response.status(200).send({
      sizeOfMetric: metrics[metricName].size()
    });
  }
}

module.exports.retrieveStatistics = function (request, response) {
  if (!request.body.metricName) {
    response.status(400).send({
      err: 'missing metricName'
    });
    return;
  }   
  var metricName = request.body.metricName;
  if (!metrics[metricName]) {
    response.status(200).send({err: 'metric name does not exist'})
  } else {
    response.status(200).send({
      arithmeticMean: metrics[metricName].average(),
      median: metrics[metricName].median(),
      min: metrics[metricName].min(),
      max: metrics[metricName].max()
    });
  }
}
module.exports.wrongEndPoint = function (request, response) {
  response.status(404).send({
    err: 'Wellcome to Metric, please enter the correct endpoint'
  });
}