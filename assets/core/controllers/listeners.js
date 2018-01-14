const store   = require('../models/store');
const toggle  = require('../views/toggle');
const option  = require('../views/option');
const select  = require('../views/select');
const submit  = require('../views/submit');
const tip     = require('../views/tip');

// ------------------------------------------------------------------

module.exports.add = function(node, event, handler) {

    let handlers = store.handlers;
    let save = {
        node: node,
        event: event,
        handler: handler
    };

    handlers.push(save);
    node.addEventListener(event, handler);

};

module.exports.remove_all = function() {

	// Get nodes from handlers store
	// Remove all listeners

    let handlers = store.handlers;
    for (var i = handlers.length; i--;) {
        var doc = handlers[i];
        doc.node.removeEventListener(doc.event, doc.handler);
    }

};

module.exports.init = function() {

    // Add new listeners for page
    toggle();
    option();
    select();
    submit();
    tip();

};