var crypto = require('crypto'),
    hash = function (pass, salt) {
        var h = crypto.createHash('sha512');
        h.update(pass);
        h.update(salt);
        return h.digest('base64');
    };

module.exports.authUser = function (email, password, callback) {
    var hashedPass=hash(password,email);
    User.findOne({email: email, password:hashedPass}, function (err, user) {
        callback(user);
    });
};