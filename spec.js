var expect = require('chai').expect;
var request = require('request');

var handler = require('./requestHandler');
var stub = require('./stub');
var Metric = require('./helperFunctions').Metric;
var BinaryHeapIndex = require('./helperFunctions').BinaryHeapIndex;

describe('Test for Metrics coding challenge: ', function() {
  describe('BinaryHeapIndex helper function ', function() {
    it('should be a function', function(done) {
      expect(typeof BinaryHeapIndex).to.equal('function')
      done();
    })
    var sampleArray = [10, 6, 5, 1, 7, 9]
    var referenceContent = {}
    var testBinaryHeapIndex = new BinaryHeapIndex(function(child, parent) {
      return child >= parent;
    }, referenceContent);
    //insert 1, 5, 6, 7, 9, 10
    sampleArray.forEach(function(element,index) {
      referenceContent[index] = {value: element}
      testBinaryHeapIndex.push(index);
    })

    it('should inserted 6 element', function(done) {
      expect(testBinaryHeapIndex.size()).to.equal(6)
      done();
    });
    it('should get Min from the top parent of min-heap', function(done) {
      expect(referenceContent[testBinaryHeapIndex.content[0]].value).to.equal(1)
      done();
    });
    it('should get new min after pop', function(done) {
      testBinaryHeapIndex.pop();
      expect(referenceContent[testBinaryHeapIndex.content[0]].value).to.equal(5)
      done();
    });
  });
  describe('Metric helper function', function() {
    it('should be a function', function(done) {
      expect(typeof Metric).to.equal('function')
      done();
    })
    var metrics = {};
    var name = 'testMetric';
    metrics[name] = new Metric(name);
    //insert 1, 5, 6, 7, 9, 10
    metrics.testMetric.insert({value: 10});
    metrics.testMetric.insert({value: 6});
    metrics.testMetric.insert({value: 5});
    metrics.testMetric.insert({value: 1});
    metrics.testMetric.insert({value: 7});
    metrics.testMetric.insert({value: 9});
    it('should inserted 6 element', function(done) {
      expect(metrics.testMetric.size()).to.equal(6)
      done();
    });
    it('should get smallest number from min function', function(done) {
      expect(metrics.testMetric.min()).to.equal(1)
      done();
    });
    it('should get largest number from max function', function(done) {
      expect(metrics.testMetric.max()).to.equal(10)
      done();
    });
    it('should get middle half from median function', function(done) {
      expect(metrics.testMetric.median()).to.equal(6.5)
      done();
    });
    it('should get average value from average function', function(done) {
      expect(metrics.testMetric.average()).to.equal([1, 5, 6, 7, 9, 10].reduce((a, b) => { return a + b }, 0) / 6)
      done();
    });    
  });

  describe('Request handler test', function() {

  })

  describe('Create a Mertic', function() {

  })

  describe('Post Values to a Metric​', function() {

  })
  describe('Retrieve Statistics', function() {

  })

})