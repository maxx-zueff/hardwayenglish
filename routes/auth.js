
// Dependencies
const express = require('express');
const router  = express.Router();

const signin  = require('../controllers/auth.signin');
const login   = require('../controllers/auth.login');

// ------------------------------------------------------------------

// Authentication
router.post('/signin', signin);
router.post('/login', login);

// ------------------------------------------------------------------

// Export module
module.exports = router;