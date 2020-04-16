var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    seedDB = require("./seeds");
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

var port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);
//seed the DB
//seedDB();

//============Passport configuration==============
app.use(require("express-session")({
    //the secret will be used to encode and decode the session
    secret: "I'm the cutest person in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//uses a new local strategy using the user.authenticate method that's coming from user.js (passportLocalMongoose)
passport.use(new LocalStrategy(User.authenticate()));
//responsible for uncoding the session, serialize it and put it back in the session
passport.serializeUser(User.serializeUser());
//responsible for reading the session, taking the data from the session that's encoded and uncoding it
passport.deserializeUser(User.deserializeUser());
//we want to run this code on every single route (check if the user is logged in, if not only show log in and signup buttons on navbar)
app.use(function (req, res, next) {
    //pass the req.user to every single template
    //whatever we put in res.locals is what is available inside of our template
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    //the next is needed in order to move on to the next middleware (route handler)
    next();
});

//requiring routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, function () {
    console.log("The Yelp Camp Server Has Started!");
});