module.exports.set = function(name, value, expires) {
    
    if (typeof expires == "number") {
        let d = new Date(expires * 1000);
        expires = d.toUTCString();
    }

    let updatedCookie = name + "=" + value;
        updatedCookie += "; expires=" + expires;

    document.cookie = updatedCookie;
};