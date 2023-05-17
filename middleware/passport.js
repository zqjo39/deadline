const passport = require('passport');
const {Strategy} = require('passport-local').Strategy;
const {User, Subscription, Permission} = require('../models');
const md5 = require('md5');

async function authenticate(username, password, done) {
    // fetch user from database
    const user = await User.findOne({
        where: {
            email: username
        }
    });
    // if no user, or passwords do not match, call done with a failure message
    if (!user || md5(password) !== user.password) {
        return done(null, false, {message: 'Incorrect email or password.'});
    }
    // passed authentication, so user passes
    return done(null, {
        id: user.id,
        username: user.email,
        displayName: user.first_name
    });
}

const validationStrategy = new Strategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    authenticate);

passport.use(validationStrategy);

passport.serializeUser(function (user, done) {
    process.nextTick(function() {
        done(null, {id: user.id, username: user.email, displayName: user.displayName});
    });
});

// turn serialized object back into an object (but in our case, we don't need to do anything)
passport.deserializeUser(async function(user, done) {
    const userModel = await User.findByPk(user.id, {
        include: [
            {
                model: Subscription,
                as: 'subscription',
                include: [
                    {
                        model: Permission,
                        as: 'permissions'
                    }
                ],
            }
        ]
    });
    process.nextTick(function() {
        return done(null, userModel);
    });
});

module.exports.passport = passport;