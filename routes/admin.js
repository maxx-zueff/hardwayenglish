
// Dependencies
const express   = require('express');
const jwt       = require('jsonwebtoken');
const router    = express.Router();

const permission = require('../controllers/permission');
const topic      = require('../controllers/topic');
const rule       = require('../controllers/rule');
const test       = require('../controllers/test');

// ------------------------------------------------------------------

// add / update / remove TOPIC
router.post('/add-topic', permission, topic.add);
router.post('/up-topic', permission, topic.update);
router.post('/del-topic', permission, topic.remove);

// ------------------------------------------------------------------

// add / update / remove RULE
router.post('/add-rule', permission, rule.add);
router.post('/up-rule', permission, rule.update);
router.post('/del-rule', permission, rule.remove);

// ------------------------------------------------------------------

// add / update / remove TEST
router.post('/add-test', permission, test.add);
router.post('/up-test', permission, test.update);
router.post('/del-test', permission, test.remove);

// ------------------------------------------------------------------

// Export module
module.exports = router;