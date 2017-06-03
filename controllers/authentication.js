const jwt = require('jwt-simple');
const User = require('../models/user');
const env = require('../.env');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, env.secret); //sub => subject of jwt token, iat => issued at time... these 2 are json web tokens conventions
}

exports.signin = function(req, res, next) {
    // User has already had email and password auth
    // We just need to give them the token
    // In passport.js done callback called and user passed as parameter. The user model is placed in req
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({error: 'You must provide email and password'});
    }
    // See if user with given email exists
    User.findOne({ email: email }, function(err, existingUser){
        if(err) { return next(err); }

        // if user with email does exist, return an error
        if(existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If user with email does not exist, create and save model
        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err){
            if(err) { return next(err); }
        });

    // Respond to request indicating the user was created
        res.json({token: tokenForUser(user)});
    });
}
