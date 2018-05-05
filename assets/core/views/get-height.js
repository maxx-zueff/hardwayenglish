module.exports = function (view, footer) {

	if (!view || !footer) return false;

	let window_height = window.innerHeight;
	let footer_height = footer.offsetHeight;

	let height = window_height - footer_height;
	view.style.minHeight = height + "px";
};