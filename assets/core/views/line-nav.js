const store = require('../models/store');
const listener = require('../controllers/listeners');


module.exports = function() {

	let trigger = store.nodes.trigger();
	if (!trigger) return false;

	let nav = trigger.nextSibling;
	let section = nav.childNodes[0];

	let section_width = section.offsetWidth;
	let trigger_width = trigger.offsetWidth;
	let trigger_title = trigger.querySelector('.navigation-title');
	let rightEdge = nav.offsetWidth - trigger.offsetWidth;

	trigger.style.left = section_width/2 - trigger_width/2 + "px";

	let config = {
		coords_nav : '',
		coords_thumb : '',
		shift: '',
		position: '',
		active: false
	};

	let set_left = function (pageX) {
		new_left = pageX - shiftX - config.coords_nav.left;
		if (new_left < 0) new_left = 0;
		if (new_left > rightEdge) new_left = rightEdge;

		trigger.style.left = new_left + 'px';
	};

	function get_coords(elem) {
		let box = elem.getBoundingClientRect();
		return { left: box.left + window.pageXOffset };
	}

	let start = function (event) {

		trigger.classList.remove('center');
		config.active = true; 
		thumb_coords = get_coords(trigger);
		config.coords_nav = get_coords(nav);
		shiftX = event.pageX - thumb_coords.left;

		set_left(event.pageX);
	};

	let move = function (event) {

		if (!config.active) return false;
		set_left(event.pageX);

		let jump = Math.ceil((new_left+trigger_width/2)/section_width)-1;
		section = nav.childNodes[jump];
		
		let title = section.getAttribute('title');
		let allowed = section.getAttribute('allowed');

		if (allowed) {
			trigger.classList.remove('locked');
			trigger.classList.add('allowed');
		}

		else {
			trigger.classList.remove('allowed');
			trigger.classList.add('locked');
		}

		trigger_title.innerHTML = title;
				
	};

	let end = function (event) {

		let jump = Math.ceil((new_left+trigger_width/2)/section_width)-1;
		let left = jump * section_width + section_width/2 - trigger_width/2;
		trigger.classList.add('center');
		trigger.style.left = left + 'px';
		config.active = false;

	};



	// ------------------------------------------------
	// LISTENERS LIST

	listener.add(trigger, 'touchstart', function(event) {

	});

	listener.add(trigger, 'touchmove', function(event) {

	});

	listener.add(trigger, 'touchend', function(event) {

	});

	listener.add(trigger, 'mousedown', function(event) {
		start(event);
	});

	listener.add(document, 'mousemove', function(event) {
		move(event);
	});

	listener.add(document, "mouseup", function(event) {
		end(event);
	});

	listener.add(trigger, "dragstart", function(event) {
		return false;
	});



};
