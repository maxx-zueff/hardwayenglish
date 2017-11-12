
// Dependencies
const express = require('express');
const router  = express.Router();

const auth    = require('../controllers/auth');
const topic   = require('../controllers/topic');
const rule    = require('../controllers/rule');

// ------------------------------------------------------------------

// Authentication
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);

// ------------------------------------------------------------------

// Get topics / rules
router.post('/get-topic', topic.get);
router.post('/get-rule', rule.get);

// Export module
module.exports = router;