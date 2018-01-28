const store = require('../models/store');
const listener = require('../controllers/listeners');

module.exports = function() {

	let nodes  = store.DOM();
	let slider = nodes.slider;
	let nav    = nodes.nav;

	let inactive = true;
	let touchstartx;
	let touchmovex;
	let longtouch;
	let movex;
	let slide_width;
	let set = 0;

	let reset = [];
	let list = [];
	let list_nav = [];

	let draw = function(hide) {

		for (let i = 0; i < list.length; i++) {
			
			let el = list[i].el;
			let position = list[i].position;
			let index = list[i].index;

			

			if (position == 0) {

				for (let f = 0; f < list_nav.length; f++) {
					list_nav[f].el.classList.remove('active');
				}

				list_nav[index].el.classList.add('active');
			}

			el.style.opacity = "1";
			if (position == hide) el.style.opacity = "0";
			el.style.left = position * 100 + "%";

		}

	};

	let next = function (steps) {

		let last = list.length-2;

		for (let i = 0; i < list.length; i++) {
			let position = list[i].position;

			// set new position
			list[i].position = position - 1;
			if (list[i].position < -1) {
				list[i].position = last;
			}
		}

		draw(last);

		let set = steps - 1;
		if (set > 0) {
			setTimeout(function() {
				next(set);
			}, 200);
		}

		setTimeout(function() {
			if (inactive) next();
		}, 1000);	
	};

	let prew = function(steps) {
		
		for (let i = 0; i < list.length; i++) {
			let position = list[i].position;

			// set new position
			list[i].position = position + 1;
			if (list[i].position > list.length-2) {
				list[i].position = -1;
			}
		}

		draw(-1);

		let set = steps - 1;
		if (set > 0) {
			setTimeout(function() {
				prew(set);
			}, 200);
		}

	};

	slider.forEach(function(el, index, arr) {

		let position = index;
		if (index == arr.length-1) position = -1;

		let item = {
			el: el,
			position: position,
			index: index
		};

		list.push(item);

		listener.add(el, 'touchstart', function(event) {

			inactive = false;
			
			slide_width = el.clientWidth;
			touchstartx =  event.targetTouches[0].pageX;

			reset.splice(0, reset.length);
			for (let i = 0; i < list.length; i++) {
				let position = list[i].position;
				reset.push({position:position});
			}

			longtouch = false;
			setTimeout(function() {
				longtouch = true;
			}, 250);

		});

		listener.add(el, 'touchmove', function(event) {


			touchmovex =  event.changedTouches[0].pageX;
			movex = touchmovex - touchstartx;

			set = movex / slide_width;

			for (let i = 0; i < reset.length; i++) {
				let position = reset[i].position;
				list[i].position = position + set;
			}

			draw();

		});

		listener.add(el, 'touchend', function(event) {

			for (let i = 0; i < reset.length; i++) {
				let position = reset[i].position;
				list[i].position = position;
			}

			if (Math.abs(set) > 0.5 || longtouch === false) {

				if (set > 0) prew();
				if (set < 0) next();

				set = 0; 

			}

			else draw();

		});

	});

	nav.forEach(function(el, index, arr) {

		let item = {
			el: el,
			index: index
		};

		list_nav.push(item);
	});



	for (let i = 0; i < list_nav.length; i++) {

		let el = list_nav[i].el;
		let index = list_nav[i].index;

		listener.add(el, 'click', function() {

			inactive = false;

			let curent_item;
			let new_item;

			for (let i = 0; i < list_nav.length; i++) {
				list_nav[i].el.classList.remove('active');
			}

			el.classList.add('active');

			for (let f = 0; f < list.length; f++) {
				if (list[f].index == index) new_item = list[f];
				if (list[f].position == 0) curent_item = list[f];
			}

			let delta = curent_item.index - new_item.index;
			if (delta < 0) next(delta*-1);
			if (delta > 0) prew(delta);

		});

	}

	draw();

	setTimeout(function() {
		next();
	}, 1000);	

};