let getAll = (el) => {
	return document.querySelectorAll(el);
};

let getSingle = (el) => {
	return document.querySelector(el);
};

module.exports.addHandlers = function(save) {
	handlers.push(save);
};

module.exports.removeAllHandlers = function() {
	for (var i = handlers.length; i--;) {
        var doc = handlers[i];
        doc.node.removeEventListener(doc.event, doc.handler);
    }

    handlers.length = 0;
};

module.exports.showHandlers = function() {
	console.log(handlers);
};

module.exports.nodes = {

	// JS nodes
	link: () => getAll('.js-link'),
	toggled: () => getAll('.js-toggle'),
	option: () => getAll('.js-option'),
	select: () => getAll('.js-select'),
	submit: () => getAll('.js-submit'),
	tip: () => getAll('.js-tip'),
	wait: () => getAll('.js-wait'),
	trigger: () => getSingle('.js-trigger'),

	// DOM nodes
	menu: () => getSingle('.menu'),
	slogan: () => getSingle('.intro-slogan'),
	slider: () => getAll('.slider-item'),
	nav: () => getAll('.slider-navigation__item'),
	view: () => getSingle('#view'),
	footer: () => getSingle('footer')
};

let handlers = [];

module.exports.views = {

	guest: {
		status : false,
		list : [{
			name: 'get-height',
			path: '../views/get-height',
			nodes: ['view', 'footer']
		}]
	},

	member : {
		status : false,

	},

	admin : {
		status : false,

	}

};