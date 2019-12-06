const express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX
router.get('/', (req, res) => {
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampground });
        }
    });
});
//CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: desc, author: author };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});
//NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//SHOW
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

//EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

//DETETE campground route

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });

});

module.exports = router;