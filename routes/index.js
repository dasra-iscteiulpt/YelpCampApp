var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// root route
router.get("/", function (req, res) {
    res.render("landing");
});

//==================AUTH ROUTES======================
//Show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handling user sign up
router.post("/register", function (req, res) {
    //when we create a user we only pass a username, not the password. The pw is not saved to the DB. The pw is passed as a second argument to user.register.
    //The user.register will take the 2nd argument an hash the pw and stores that in the DB.
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {         
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        else {
            //passport.authenticate will log the user in and it will take care of everything in the session
            //it uses local passport (if we need , we can change it to twitter or fb)
            passport.authenticate("local")(req, res, function () {
                req.flash("success","Welcome to YelpCamp" + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
});

//Login ROUTES
//Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//handling login logic
//passport.authenticate is a middleware (it's a code that runs before the final callback)
//passport.authenticate checks if you can login
//the password.authenticate calls the authenticate method that comes from the mongoose package
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    //res.render("login");
});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out")
    res.redirect("/campgrounds");
});

module.exports = router;