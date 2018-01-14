
// Dependencies
const express = require('express');
const router  = express.Router();

const auth    = require('../controllers/auth');
const topic   = require('../controllers/topic');
const rule    = require('../controllers/rule');
const test    = require('../controllers/test');

// ------------------------------------------------------------------

// Authentication
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.post('/available', auth.available);

// ------------------------------------------------------------------

// Get topics/rules/tests
router.post('/get-topic', topic.get);
router.post('/get-rule', rule.get);
router.post('/get-test', test.get);

// Send statistic
router.post('/stat-rule', rule.stat);

// Check test
router.post('/check-test', test.check);

// Export module
module.exports = router;