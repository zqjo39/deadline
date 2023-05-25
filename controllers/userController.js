const {User, Subscription, Permission} = require('../models');
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
            last_name: req.body.last_name,
            subscription_id: 1,
            font_id: 1,
            theme_id: 1
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
    const user = await User.findByPk(req.user.id, {
        include: {
            model: Subscription,
            as: 'subscription',
            include: [
                {
                    model: Permission,
                    as: 'permissions'
                }
            ]
        }
    });
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    console.log(user);
    res.render('todos/profile', {user, font, theme})
}

module.exports.renderPerks = function(req, res) {
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    res.render('todos/perks', {font, theme});
}

module.exports.viewPerks = async function(req, res) {
    await User.update({
        font_id: req.body.font_id,
        theme_id: req.body.theme_id
    }, {
        where: {
            id: req.user.id
        }
    })
    res.redirect('/');
}

module.exports.setToBasic = async function(req, res) {
    await User.update({
        subscription_id: 1
    }, {
        where: {
            id: req.user.id
        }
    })
    res.redirect('/');
}

module.exports.setToStandard = async function(req, res) {
    await User.update({
        subscription_id: 2
    }, {
        where: {
            id: req.user.id
        }
    })
    res.redirect('/');
}

module.exports.setToPremium = async function(req, res) {
    await User.update({
        subscription_id: 3
    }, {
        where: {
            id: req.user.id
        }
    })
    res.redirect('/');
}


module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};

function translateFont(font_id) {
    if (font_id === '1') {
        return ''
    } else if (font_id === '2') {
        return 'arial'
    } else if (font_id === '3') {
        return 'times-new-roman'
    } else if (font_id === '4') {
        return 'comic-sans'
    } else {
        return ''
    }
}

function translateTheme(theme_id) {
    if (theme_id === '1') {
        return ''
    } else if (theme_id === '2') {
        return 'dark'
    } else if (theme_id === '3') {
        return 'woodland'
    } else if (theme_id === '4') {
        return 'rose'
    } else {
        return ''
    }
}