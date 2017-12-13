const store   = require('../models/store');

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

module.exports.removeAll = function() {

	// Get nodes from handlers store
	// Remove all listeners

    let handlers = store.handlers;
    for (var i = handlers.length; i--;) {
        var doc = handlers[i];
        doc.node.removeEventListener(doc.event, doc.handler);
    }

};