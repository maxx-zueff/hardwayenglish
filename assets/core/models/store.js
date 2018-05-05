let getAll = (el) => {
	return document.querySelectorAll(el);
};

let getSingle = (el) => {
	return document.querySelector(el);
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

module.exports.handlers = [];
