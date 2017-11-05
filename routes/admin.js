
// Dependencies
const express   = require('express');
const jwt       = require('jsonwebtoken');
const router    = express.Router();


const permission = require('../controllers/permission');
const topic      = require('../controllers/topic');

// ------------------------------------------------------------------

// add / update / remove topic
router.post('/add-topic', permission, topic.add);
router.post('/up-topic', permission, topic.update);
router.post('/del-topic', permission, topic.remove);

// ------------------------------------------------------------------

// Export module
module.exports = router;