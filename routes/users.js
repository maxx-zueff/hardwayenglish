
// Dependencies
const express = require('express');
const router  = express.Router();

const auth    = require('../controllers/auth');
const topic   = require('../controllers/topic');

// ------------------------------------------------------------------

// Authentication
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);

// ------------------------------------------------------------------

// Get topics
router.post('/get-topic', topic.get);

// Export module
module.exports = router;