const passport = require('passport');
const User = require('../models/user');
const env = require('../.env');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = {usernameField: 'email'}; // Tell local login to look at email property instead of default username property
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    // Verify this username and password, call done if user found, call false if not
    User.findOne({ email:email }, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false);

        // compare password - is password equal to user password
        user.comparePassword(password, function(err, isMatch){
            if(err) return done(err);

            if(!isMatch) return done(null, false);

            return done(null, user);
        })

    })
});
//Set up options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: env.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    User.findById(payload.sub, function(err, user){
        if(err) { return done(err, false); }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    })
    // See if user id in payload exists in database, if so calll done with that user object
    // otherwise call done without user object
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
