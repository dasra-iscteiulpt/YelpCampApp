var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index.js");

//INDEX Route - Show all campgrounds
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

//CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //Get data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var campground = { name: name, price:price, image: image, description: description, author: author };
    //Create a new campground and save to DB
    Campground.create(campground, function (err, newCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW route - Show form to create new DB
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW route - Show info about a specific campground
router.get("/:id", function (req, res) {
    //Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        }
        else {
            //Render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.isUserTheOwnerOfTheCampground, function (req, res) {
    //is user logged in?
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });

    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.isUserTheOwnerOfTheCampground, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.isUserTheOwnerOfTheCampground, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect to show page
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;