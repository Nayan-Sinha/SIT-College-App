
// Importing Libraies that we installed using npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
//const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")

var mongoose=require("mongoose");
const username = "nayankumar1";
const password = "gdlOQnq8i65PhH28";
const cluster = "cluster0.egyqx";
const dbname = "";

// db connection
mongoose
	.connect(`mongodb+srv://nayankumar1:${password}@cluster0.ez3oryu.mongodb.net/?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
	console.log(`DB connection error: ${err.message}`);
});

require("./schema/user")
require("./schema/contact")
const User=mongoose.model("User");
const Contact=mongoose.model("Contact");

//const User = require("./schema/user");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const initializePassport = require("./passport-config")
// initializePassport(
//     passport,
//     email => User.find(user => user.email === email),
//     _id => User.find(user => user._id === _id)
//     )

initializePassport(
    passport,
    email => User.findOne({email :email}),
    _id => User.findOne({_id:_id})
    )

const users = []
const contactDetails = []
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))


//data store model connection
//require("./schema/user")
//const initializePassport = require("./passport-config")

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        const newuser=new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        newuser.save().then((result=>console.log("Successfully created")))

        console.log(users); // Display newly registered in the console
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

// Configuring the Contact Us post functionality
app.post("/contact", checkAuthenticated, async (req, res) => {

    try {
       console.log(req);
        contactDetails.push({
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            text: req.body.inputtext,
        })

        const newcontact=new Contact({ 
            name: req.body.name,
            email: req.body.email,
            text: req.body.inputtext,
        })
        newcontact.save().then (res=>console.log("Successfully Contact Saved"))



        console.log(contactDetails); // Display newly registered in the console
        res.redirect("/")
        
    } catch (e) {
        console.log(e);
        res.redirect("/")
    }
})

// Routes
app.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs", {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})

app.get('/contact', checkAuthenticated, (req, res) => {
    res.render("contact.ejs")
})

// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next()
}

//app.listen(3000)
app.listen(3000, () => {
	console.log(`Server running at port  3000`);
})