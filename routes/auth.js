
// Dependencies
const express = require('express');
const router  = express.Router();

const auth    = require('../controllers/auth');

// ------------------------------------------------------------------

// Authentication
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);

// ------------------------------------------------------------------

// Export module
module.exports = router;