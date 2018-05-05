const store      = require('../models/store');
const toggle     = require('../views/toggle');
const option     = require('../views/option');
const select     = require('../views/select');
const submit     = require('../views/submit');
const tip        = require('../views/tip');
const link       = require('../views/link');
const typewriter = require('../views/typewriter');
const slider     = require('../views/slider');
const get_height = require('../views/get-height');
const wait       = require('../views/waiter');
const nav        = require('../views/line-nav');

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

    // Nodes for listeners
    let nodes = {
        view   : store.nodes.view(),
        footer : store.nodes.footer(),
        toggle : store.nodes.toggled(),
        option : store.nodes.option(),
        select : store.nodes.select(),
        submit : store.nodes.submit()
    };

    // Add new listeners for page
    get_height(nodes.view, nodes.footer);
    toggle(nodes.toggle);
    option(nodes.option);
    select(nodes.select);
    submit(nodes.submit);

    tip();
    link();
    nav();
    wait();
    typewriter();
    slider();

};
