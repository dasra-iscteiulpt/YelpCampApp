var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.isUserTheOwnerOfTheComment = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash('error', 'Comment Not Found');
                res.redirect("back");
            } else {
                //does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash('error', "You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash('error', 'Please Login First!');
        res.redirect("back");
    }
};

middlewareObj.isUserTheOwnerOfTheCampground = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash('error', 'Campground Not Found');
                res.redirect("back");
            } else {
                //does the user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash('error', "You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash('error', 'Please Login First!')
        res.redirect("back");
    }
};

//middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated())
        //moves on to rendering the new campground/comment form
        return next();
    req.flash('error', 'Please Login First!');
    //otherwise redirects to login
    res.redirect("/login");
};

module.exports = middlewareObj;