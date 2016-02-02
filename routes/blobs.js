var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyparser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body == 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method
		delete req.body._method
		return method
	}
}));

// build the REST operations at the base for blobs this will be accessible from http://127.0.0.1:3000/blobs if the default route for '/' is left unchanged

// GET blobs
router.route('/').get(function (req, res, next) {
	// retrieve all blobs from MongoDB
	mongoose.model('Blob').find({}, function (err, blobs) {
		if (err) {
			return console.error(err);
		}
		else {
			// respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
			res.format({
				//HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
				html: function () {
					res.render('blobs/index', {
						title: 'All my blobs',
						"blobs": blobs
					});
				},
				// JSON response will show all blobs in JSON format
				json: function () {
					res.json(blobs);
				}
			});
		}
	});
})

// POST a new blob
router.route('/').post(function (req, res) {
	// get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
	var name = req.body.name;
	var bagde = req.body.badge;
	var dob = req.body.dob;
	var isLoved = req.body.isLoved;
	
	// call the create function for our database
	mongoose.model('Blob').Create({
		name: name,
		bagde: bagde,
		dob: dob,
		isLoved: isLoved
	}, function (err, blob) {
		if (err) {
			res.send('There was a problem adding the information to the database.');
		}
		else {
			// blob has been created
			console.log('POST creating new blob: ' + blob);
			res.format({
				// HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
				html: function () {
					// if it worked, set the header so the address bar doesn't still say /adduser
					res.location('blobs');
					// and forward to success page
					res.redirect('/blobs');
				},
				json: function () {
					// JSON response will show the newly created blob
					res.json(blob);
				}
			});
		}
	});
});

// GET New Blob page
// ToDo: Check what happens if one change it to router.route('/new').get(function(...
router.get('/new', function (req, res) {
	res.render('blobs/new', { title: 'Add New Blob' });
});

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
	console.log('Validating if ' + id + ' exists');
	// find the ID in the Database
	mongoose.model('Blob').findById(id, function (err, blob) {
		// if it isn't found, we are going to repond with 404
		if (err) {
			console.log(id + ' was not found');
			res.status(404);
			var err = new Error('Not found');
			err.status = 404;
			res.format({
				html: function () {
					next(err);
				},
				json: function () {
					res.json({ message: err.status + ' ' + err });
				}
			});
		}
		// if it is found we continue on
		else {
			console.log(id + ' was found');
			// once validation is done save the new item in the req
			req.id = id;
			// go to next thing
			next();
		}
	});
});

// GET the individual blob 
router.route('/:id').get(function (req, res) {
	// search for the blob within Mongo
	mongoose.model('Blob').findById(req.id, function (err, blob) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		}
		else {
			console.log('GET Retrieving ID: ' + blob._id);
			var blobDob = blob.dob.ToISOString();
			blobDob = blobDob.substring(0, blobDob.indexOf('T'));
			res.format({
				// HTML response will render the 'show.jade' template
				html: function () {
					res.render('blobs/show', {
						blobDob: blobDob,
						blob: blob
					});
				},
				// JSON response will return the JSON output
				json: function () {
					res.json(blob);
				}
			});
		}
	});
});

// GET the individual blob (for edit)
// ToDo: Check what happens if one change it to router.route('/:id/edit').get(function(...
router.get('/:id/edit', function (req, res) {
	// search for the blob within Mongo
	mongoose.model('Blob').findById(req.id, function (err, blob) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		}
		else {
			console.log('GET Retrieving ID: ' + blob._id);
			var blobDob = blob.dob.ToISOString();
			blobDob = blobDob.substring(0, blobDob.indexOf('T'));
			res.format({
				// HTML response will render the 'edit.jade' template
				html: function () {
					res.render('blobs/edit', {
						blobDob: blobDob,
						blob: blob
					});
				},
				// JSON response will return the JSON output
				json: function () {
					res.json(blob);
				}
			});
		}
	});
});

// PUT to update a blob by ID
// ToDo: Check what happens if one change it to router.route('/:id/edit').put(function(...
router.put('/:id/edit', function (req, res) {
	// get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
	var name = req.body.name;
	var bagde = req.body.badge;
	var dob = req.body.dob;
	var isLoved = req.body.isLoved;
	
	// search for the blob within Mongo
	mongoose.model('Blob').findById(req.id, function (err, blob) {
		if (err) {
			return console.error(err);
		} 
		else {
			// update it
			blob.update({
				name: name,
				bagde: bagde,
				dob: dob,
				isLoved: isLoved
			}, function (err, blobId) {
				if (err) {
					res.send("There was a problem updating the information to the database: " + err);
				} 
				else {
					console.log('PUT Updating ID: ' + blob._id);
					res.format({
						// HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
						html: function () {
							res.redirect('/blobs/' + blob._id);
						},
						// JSON responds showing the updated values
						json: function () {
							res.json(blob);
						}
					});
				}
			});
		}
	});
});

// DELETE a Blob by ID
// ToDo: Check what happens if one change it to router.route('/:id/edit').delete(function(...
router.delete('/:id/edit', function (req, res) {
	// search for the blob within Mongo
	mongoose.model('Blob').findById(req.id, function (err, blob) {
		if (err) {
			return console.error(err);
		} 
		else {
			// remove it from MongoDB
			blob.remove(function (err, blob) {
				if (err) {
					res.send("There was a problem deleting the information from the database: " + err);
				}
				else {
					console.log('DELETE Deleting ID: ' + blob._id);
					res.format({
					// HTML returns us back to the main page, or you can create a success page
						html: function () {
							res.reditrect('/blobs');
						},
						//JSON returns the item with the message that is has been deleted
						json: function () {
							res.json({ message: 'deleted', item: blob });
						}
					});
				}
			});
		}
	});
});

module.exports = router;
