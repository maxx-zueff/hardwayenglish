const store = require('../models/store');

module.exports = function () {

	let nodes = store.DOM();
	let view = nodes.view;
	let footer = nodes.footer;

	let window_height = window.innerHeight;
	let footer_height = footer.offsetHeight;

	let height = window_height - footer_height;
	view.style.minHeight = height + "px";
};