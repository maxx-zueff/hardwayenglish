const store    = require('../models/store');

module.exports = function () {
	
	let nodes = store.DOM();
	nodes.wait.forEach(function(el) {

		let start = el.getAttribute("start");
		let end = el.getAttribute("end");
		let current = Math.floor(Date.now() / 1000);

		let duration = end - start;
		let delay = start - current;
		let remain = end - current;

		let ring = el.querySelector(".ring");
		let waiter = el.querySelector(".collection-waiter");

		// add prefix
		ring.style["animation-duration"] = duration + "s";
		ring.style["animation-delay"] = delay + "s";

		let set_time = function() {

			let current = Math.floor(Date.now() / 1000);

			let seconds = end - current;
			let minutes = Math.floor(seconds/60);
			let hours = Math.floor(seconds/60/60);
			let days = Math.floor(seconds/60/60/24);

			if (days >= 1) { 
				waiter.innerHTML = days + " days";
			}

			if (hours >= 1) {
				waiter.innerHTML = hours + " hours";
			}

			else {
				let sec = seconds - (minutes * 60);
				if (sec<10) sec = "0" + sec;
				if (minutes<10) minutes = "0" + minutes;
				if (minutes<1) minutes = "00";

				waiter.innerHTML = minutes + ":" + sec + " min";
			}

			if (seconds < 1) return waiter.innerHTML = "";

			setTimeout(function(){
				set_time();
			}, 1000);

		};

		set_time();

		setTimeout(function() {
			el.classList.remove("animation");
		}, remain*1000);

	});


};