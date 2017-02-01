var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var mocha = require('mocha');
var app = require('./server');

var requestHandler = require('./requestHandler');
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
      testBinaryHeapIndex.push(index, referenceContent);
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
      testBinaryHeapIndex.pop(referenceContent);
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
  describe('Create a Metric', function() {
    it('should create new metric if there is not duplicate', function(done) {     
      request(app)
        .post('/api/createmetric')
        .send({
          metricName: 'Neo'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.equal('Neo');
          done()
        });        
    })
    it('should not overwrite existing metric, if attempt to create existing metric', function(done) {     
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'Neo',
          value: 12
        })
        .end(() => {});
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'Neo',
          value: 20
        })
        .end(() => {});        
      request(app)
        .post('/api/createmetric')
        .send({
          metricName: 'Neo'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.err).to.equal('metric already exist');
        }); 
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'Neo',
          value: 25
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.sizeOfMetric).to.equal(3);
          done();
        });
    })    
  });
  describe('Post values to a Metric​', function() {
    it('should insert a value', function(done) {     
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'Neo',
          value: 10
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.sizeOfMetric).to.equal(4);
          done()
        });
    });       
    it('should create and metric and insert a value if the metric name is new', function(done) {     
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'Ava',
          value: 10
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.sizeOfMetric).to.equal(1);
          done()
        });        
    });
    it('should be able to insert multiple values', function(done) {     
      request(app)
        .post('/api/postvalues')
        .send({
          metricName: 'HR',
          value: [1, 6, 7, 2, 90, 3, 14, 7, 9]
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.sizeOfMetric).to.equal(9);
          done()
        });        
    });      
  });
  describe('Retrieve statistics data', function() {
    it('should retrieve statistics data', function(done) {     
      request(app)
        .get('/api/retrievestatistics')
        .send({
          metricName: 'Neo',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.arithmeticMean).to.equal(16.75);
          expect(res.body.median).to.equal(16);
          expect(res.body.min).to.equal(10);
          expect(res.body.max).to.equal(25);
          done()
        });        
    }); 
    it('should respond with error message if the metric name does not exist', function(done) {     
      request(app)
        .get('/api/retrievestatistics')
        .send({
          metricName: 'Bing',
        })
        .expect(200)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true);
          done()
        });        
    });    
  });
  describe('Handle Error', function() {
    it('should respond 400 if metric name is not string', function(done) {
      request(app)
        .post('/api/createmetric')
        .send({
          metricName: ['err'],
        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 400 if post value is not a number or array', function(done) {
      request(app)
        .post('/api/createmetric')
        .send({
          metricName: 'errTest',
          value: 'wrongvalue'
        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 400 if post value is array, which contains non-number element', function(done) {
      request(app)
        .post('/api/createmetric')
        .send({
          metricName: 'errTest',
          value: [1, 'wrongvalue']
        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 400 if missing parameter for post value', function(done) {
      request(app)
        .post('/api/postvalues')
        .send({

        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 400 if missing parameter for create metric', function(done) {
      request(app)
        .post('/api/createmetric')
        .send({

        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 400 if missing parameter for retrieving statistics', function(done) {
      request(app)
        .get('/api/retrievestatistics')
        .send({

        })
        .expect(400)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })
    it('should respond 404 if the endpoint is incorrect', function(done) {
      request(app)
        .get('/~~ss')
        .send({

        })
        .expect(404)
        .end((err, res) => {
          expect(!!res.body.err).to.equal(true)
          done();
        })
    })     
  });

});