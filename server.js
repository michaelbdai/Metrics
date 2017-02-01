var express = require('express');
var bodyParser = require('body-parser');
var requestHandler = require('./requestHandler');

var router = require('express').Router();

// console.log(typeof requestHandler.createMetric);

var app = express();

// Parse JSON (uniform resource locators)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For larger scale App, the router configuration should be in a separate file
router.post('/createmetric', requestHandler.createMetric);
router.post('/postvalues', requestHandler.postValues);
router.get('/retrievestatistics', requestHandler.retrieveStatistics);
router.post('/_RESET_', requestHandler.reset);

app.use('/api', router);



console.log('Metrics is listening on 4568');
app.listen(4568);

module.exports = app;