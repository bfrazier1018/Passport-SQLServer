const passport = require('passport');
require('./strategies/local.strategy.js')();

module.exports = function passportConfig(app) {

	app.use(passport.initialize());
	app.use(passport.session());

	// Stores User in Session
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	// Retrieves User from Session
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
};