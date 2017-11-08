
// Dependencies
const express   = require('express');
const jwt       = require('jsonwebtoken');
const router    = express.Router();

const permission = require('../controllers/permission');
const topic      = require('../controllers/topic');
const rule       = require('../controllers/rule');

// ------------------------------------------------------------------

// add / update / remove topic
router.post('/add-topic', permission, topic.add);
router.post('/up-topic', permission, topic.update);
router.post('/del-topic', permission, topic.remove);

// ------------------------------------------------------------------

// add / update / remove topic
router.post('/add-rule', permission, rule.add);
router.post('/up-rule', permission, rule.update);
router.post('/del-rule', permission, rule.remove);

// ------------------------------------------------------------------

// Export module
module.exports = router;