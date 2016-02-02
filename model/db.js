var nconf = require('nconf');
var mongoose = require('mongoose');

var host = nconf.get('mongoDbHost');
var port = nconf.get('mongoDbPort');

mongoose.connect(host + ':' + port);