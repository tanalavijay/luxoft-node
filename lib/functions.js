const crypto = require('crypto');
const config = require('../config');

exports.encrypt = function (text) {
    var cipher = crypto.createCipher(config.algorithm, config.sessionSecret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (text) {
    var decipher = crypto.createDecipher(config.algorithm, config.sessionSecret);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.randomValueBase64 = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

exports.capitalizeString = function( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
