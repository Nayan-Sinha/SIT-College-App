var mongoose=require("mongoose");

const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const User=mongoose.model("User");
// const User = require("./schema/user");

function initialize(passport, getUserByEmail, getUserById){
    // Function to authenticate users
    const authenticateUsers = async (email, password, done) => {
        // Get users by email
        //const user = getUserByEmail(email)
        console.log(email, password)
        const user = await User.findOne({email:email}) .then(founduser=>{
            if( bcrypt.compare(password, founduser.password)){
                return founduser
            } else{
                return done (null, false, {message: "Password Incorrect"})
            }
        })
        console.log(user)
        if (user == null){
            return done(null, false, {message: "No user found with that email"})
        }
        try {
            return done(null, user)
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((_id, done) => {
        return done(null, getUserById(_id))
    })
}

module.exports = initialize