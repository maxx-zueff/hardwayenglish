
// Dependencies
const express = require('express');
const router  = express.Router();

const signup  = require('../controllers/auth.signup');
const signin  = require('../controllers/auth.signin');

// ------------------------------------------------------------------

// Authentication
router.post('/signup', signup);
router.post('/signin', signin);

// ------------------------------------------------------------------

// Export module
module.exports = router;