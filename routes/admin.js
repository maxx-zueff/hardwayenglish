
// Dependencies
const express   = require('express');
const jwt       = require('jsonwebtoken');
const router    = express.Router();


const permission = require('../controllers/admin.permission');
const add_topic  = require('../controllers/topic.add');
const del_topic  = require('../controllers/topic.remove');

// ------------------------------------------------------------------

// Add / remove topic
router.post('/add-topic', permission, add_topic);
router.post('/del-topic', permission, del_topic);

// ------------------------------------------------------------------

// Export module
module.exports = router;