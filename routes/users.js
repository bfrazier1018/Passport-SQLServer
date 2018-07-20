var express = require('express');
var router = express.Router();
const sql = require('mssql');
const passport = require('passport');
const { poolPromise } = require('../config/database/database.js');

// List All Users
router.get('/', (req, res) => {

	(async function findAllUsers() {
		try {
			const pool = await poolPromise;
			const result = await pool.request()
				.query('SELECT * FROM users');
			res.render('users', {
				title: 'Users',
				users: result.recordset
			});
		} catch (err) {
			console.log(err);
		}
	})()
});

// New User Sign Up Form -- GET
router.get('/register', (req, res) => {

	res.render('register', {
		title: 'User Registration'
	});
});

// Create New User -- POST 
router.post('/register', (req, res) => {

	(async function addUser() {
		try {
			const pool = await poolPromise;
			const result = await pool.request()
				.input('fullName', sql.Text, req.body.fullName)
				.input('email', sql.VarChar, req.body.email)
				.input('password', sql.Text, req.body.password)
				.query('INSERT INTO users(email, fullName, password) VALUES(@email, @fullName, @password)');
			// Login User and Redirect to User Profile
			req.login(req.body, () => {
				res.redirect('/users/profile');
			});
		} catch (err) {
			console.log(err);
		}
	})()
});

// User Sign In -- GET
router.get('/signin', (req, res) => {
	res.render('signin', {
		title: 'Sign In'
	});
});

// Sign In Authentication -- POST
router.post('/signin', passport.authenticate('local', {
	successRedirect: '/users/profile',
	failureRedirect: '/users/signin',
}));

// User Logout 
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/users/signin');
});

// User Profile
router.get('/profile', (req, res) => {

	// If User Signed In
	// Able to also do if (req.user.isAdmin)... 
	if (req.user) {
		res.json(req.user);
	} else {
		res.redirect('/users/signin');
	}
});

// List One User
router.get('/:id', (req, res) => {

	(async function findOneUser() {
		try {
			const pool = await poolPromise;
			const result = await pool.request()
				.input('id', sql.Int, req.params.id)
				.query('SELECT * FROM users WHERE id = @id');
			res.render('user', {
				title: 'User',
				user: result.recordset[0]
			});
		} catch (err) {
			console.log(err);
		}
	})()
});

// Delete User
router.delete('/:id', (req, res) => {
	
	(async function() {
		try {
			const pool = await poolPromise;
			const user = await pool.request()
				.input('id', sql.Int, req.params.id)
				.query('DELETE FROM users WHERE id = @id');
			res.redirect('/users');
		} catch (err) {
			console.log(err);
		}
	})()
});

module.exports = router;
