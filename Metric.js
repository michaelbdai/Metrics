var Metric = function (name) {
  this.name = name
  this.sum = 0;
  this.size = 0;
  this.max = null;
  this.min = null;
  this.median = null;
};
Metric.prototype.insert = function () {

}


Metric.prototype.average = function () {

}



module.exports = Metric;