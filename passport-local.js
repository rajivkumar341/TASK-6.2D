'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user-model');

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });  
});

passport.use('local.login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    User.findOne({email : email}, function(err, user){
        const messages = [];
        if(err) {
            return done(err, req.flash('error', messages));
        }
        if(!user || !user.comparePassword(password)) {
            messages.push('Email Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
		if(req.body.remember) {
			req.session.remember = true;
		}
        return done(null, user);
    });
}));

passport.use('local.signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    User.findOne({email : email}, function(err, user){
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, false, req.flash('error', 'User with email already exist'));
        }
        var newUser = new User();
        
		newUser.country = req.body.country;
		
		newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        
		newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        
		newUser.address = req.body.address;
		newUser.city = req.body.city;
		newUser.state = req.body.state;
		
		newUser.contact_number = req.body.contact_number;
        newUser.zip_code = req.body.zip_code;
        
		newUser.save((err) => {
            done(null, newUser);
        });
    });
}))