module.exports = function(req, res, next) {

	let body = req.body;
	let update = {};

	for (var par in body) {
		update[par] = body[par];
	}

	req.params = update;
	next();

	// res.json(update);

};