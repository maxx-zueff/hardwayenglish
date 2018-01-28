// Dependencies
const express = require('express');
const router  = express.Router();

// ------------------------------------------------------------------
// Blocks

router.post('/a', function(req, res) {
	res.send('AAAAA');
});

router.post('/', function(req, res) {
	console.log('HERE!');
	res.render('blocks/intro');
});

// ------------------------------------------------------------------

// Export module
module.exports = router;