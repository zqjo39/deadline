const {User} = require('../models');
const md5 = require('md5');
const passport = require('passport');

module.exports.renderRegistration = function (req, res) {
    res.render('users/register')
};

module.exports.register = async function (req, res) {
    const existingUser = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        res.render('users/register', {
            error: 'User Already Exists'
        })
    } else {
        await User.create({
            email: req.body.email,
            password: md5(req.body.password),
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });
        res.redirect('/');
    }
};

module.exports.renderLogin = function (req, res) {
    let error = null;
    if (req.session.messages && req.session.messages.length > 0) {
        error = req.session.messages[0];
    }
    res.render('users/login', {error});
};

module.exports.authenticate = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
});

module.exports.viewProfile = async function(req, res) {
    const user = await User.findByPk(req.params.id);
    console.log(user);
    res.render('todos/profile', {user})
}

module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};