var express = require('express');
var bodyParser = require('body-parser');
var requestHandler = require('./requestHandler');

var router = require('express').Router();

var app = express();

// Parse JSON (uniform resource locators)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply for hand input type error
router.use(requestHandler.checkInputDataType);

router.post('/createmetric', requestHandler.createMetric);
router.post('/postvalues', requestHandler.postValues);
router.get('/retrievestatistics', requestHandler.retrieveStatistics);
router.post('/_RESET_', requestHandler.reset);

app.use('/api', router);
app.get('/*', requestHandler.wrongEndPoint);
app.post('/*', requestHandler.wrongEndPoint);



console.log('Metrics is listening on 4568');
app.listen(4568);

module.exports = app;