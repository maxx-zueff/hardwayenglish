
// Dependencies
const express   = require('express');
const jwt       = require('jsonwebtoken');
const router    = express.Router();


const add_topic = require('../controllers/topic.add');
const del_topic = require('../controllers/topic.remove');

// ------------------------------------------------------------------

// Add / remove topic
router.post('/add-topic', add_topic);
router.post('/del-topic', del_topic);

// ------------------------------------------------------------------

// Export module
module.exports = router;