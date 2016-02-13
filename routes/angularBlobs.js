var express = require('express');
var router = express.Router();
var path = require('path');

// GET blobs
router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/app/angularBlobs/views/index.html'));
});

module.exports = router;