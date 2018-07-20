const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sql = require('mssql');
const { poolPromise } = require('../database/database.js');

module.exports = function localStrategy() {

	passport.use(new LocalStrategy({
			usernameField: 'email', 
			passwordField: 'password'
		}, 

		(username, password, done) => {
			
			(async function findOneUser() {
				try {
					const pool = await poolPromise;
					const result = await pool.request()
						.input('email', sql.VarChar, username)
						.query('SELECT * FROM users WHERE email = @email');
					const user = result.recordset[0];
					console.log(user);

					if (user.password === password) {
						done(null, user);
					} else {
						done(null, false);
					}
				} catch (err) {
					console.log(err.stack);
				}
			})();
		}));
};