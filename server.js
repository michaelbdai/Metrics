var express = require('express');
var bodyParser = require('body-parser');
const router = require('express').Router();

var app = express();

// Parse JSON (uniform resource locators)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', router);





console.log('Metrics is listening on 4568');
app.listen(4568);