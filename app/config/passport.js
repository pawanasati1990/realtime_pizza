
//const LocalStrategy = require('passport-local').Strategy
import  passportLocal from 'passport-local';
import User from '../models/user.js'
import bcrypt from 'bcrypt'
const LocalStrategy = passportLocal.Strategy;
function passportInit(passport) {

    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Login
        //check if email exists
        const user = await User.findOne({ email: email })

        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, { message: 'User login successfully' })
            }

            return done(null, false, { message: 'Wrong username or password' })

        }).catch(err=>{
            return done(null, false, { message: 'Something went wrong '})
        })
    }))

    passport.serializeUser((user,done)=>{
            done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
           done(err,user)
        })
    })

}

export default passportInit