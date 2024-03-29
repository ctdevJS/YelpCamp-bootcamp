const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User =require('./models/user'),
      seedDB = require('./seeds');

      mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
      app.use(bodyParser.urlencoded({ extended: true }));
      app.set('view engine', 'ejs');
      app.use(express.static(__dirname + '/public'));
      app.use(methodOverride('_method'));
      app.use(flash());

      //Seed the database
      //   seedDB();

      //requiring routes
      var commentRoutes = require('./routes/comments');
      var campgroundRoutes = require('./routes/campgrounds');
      var authRoutes = require('./routes/auth');


//PASSPORT CONFIG

app.use(require('express-session')({
    secret: 'very secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, function () {
    console.log('http://localhost:3000');
});