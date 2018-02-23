const store = require('../models/store');
const listener = require('../controllers/listeners');


module.exports = function() {

	let nodes = store.DOM();
	let trigger = nodes.trigger;

	trigger.forEach(function(el) {

		let section = el.parentNode;
		let nav = el.parentNode.parentNode;

		let slider_coords;
		let thumb_coords;
		let shiftX;
		let active;
		let new_left;

		let start = function (event) {

			active = true; 
			thumb_coords = get_coords(el);

			section.removeChild(el);
			nav.appendChild(el);
			el.classList.toggle('centered');
			shiftX = event.pageX - thumb_coords.left;
			slider_coords = get_coords(nav);

			new_left = event.pageX - shiftX - slider_coords.left;
			el.style.left = new_left + 'px';

		};

		let move = function (event) {

			if (active) {

				new_left = event.pageX - shiftX - slider_coords.left;
				let rightEdge = nav.offsetWidth - el.offsetWidth;

				if (new_left < 0) new_left = 0;
				if (new_left > rightEdge) new_left = rightEdge;
				
				el.style.left = new_left + 'px';
			} else return false;

		};

		let end = function (event) {

			nav.removeChild(el);

			let jump = Math.ceil(new_left/section.offsetWidth)-1;
			for (var i = 0; i < nav.childNodes.length; i++) {
				section = nav.childNodes[jump];
			}
			section.appendChild(el);

			el.style.left = '';
			active = false;
			el.classList.toggle('centered');

		};

		function get_coords(elem) {
			let box = elem.getBoundingClientRect();
			return { left: box.left + window.pageXOffset };

		}

		listener.add(el, 'touchstart', function(event) {

		});

		listener.add(el, 'touchmove', function(event) {

		});

		listener.add(el, 'touchend', function(event) {

		});

		listener.add(el, 'mousedown', function(event) {
			start(event);
		});

		listener.add(document, 'mousemove', function(event) {
			move(event);
		});

		listener.add(document, "mouseup", function(event) {
			end(event);
		});

		listener.add(el, "dragstart", function(event) {
			return false;
		});

	});


};
