const store = require('../models/store');
const listener = require('../controllers/listeners');

module.exports = function() {
    
    let data = [ "TYPE", "WAIT", "REPEAT"];

    let nodes = store.DOM();
    let slogan = nodes.slogan.querySelector('.text');
    if (!slogan) return false;

    let type = function (text, cb) {
        for (let i = 0; i < text.length; i++) {
            setTimeout(function() {
                slogan.innerHTML = text.substring(0, i+1) + " ";
            }, 150*i);

            if (i+1 == text.length) {
                setTimeout(cb, 150*i + 1500);
            }
        }
    };

    let start = function(i) {
        if (i == data.length) i = 0;
        type(data[i], function() {
            start(i+1);
        }); 
    };

    if (document.readyState == 'interactive') {
        start(0);
    }

};