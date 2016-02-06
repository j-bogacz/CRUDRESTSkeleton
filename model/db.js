var nconf = require('nconf');
var host = nconf.get('mongoDbHost');
var port = nconf.get('mongoDbPort');

var mongoose = require('mongoose');
mongoose.connect(host + ':' + port);