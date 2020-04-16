var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//==================COMMENTS ROUTES======================
//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find campground by Id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            //Render the comments/new
            res.render("comments/new", { campground: campground });
        }
    });

});

//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something Went Wrong");
                    //console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //console.log(comment);
                    //redirect campground show page
                    req.flash("success", "Comment Added Successfully");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.isUserTheOwnerOfTheComment, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'Campground Not Found');
            res.redirect("back");
        }
        //find campground by Id
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                //Render the comments/edit
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
            }
        });
    })

});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.isUserTheOwnerOfTheComment, function (req, res) {
    //find campground by Id
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.isUserTheOwnerOfTheComment, function (req, res) {
    //find campground by Id
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;