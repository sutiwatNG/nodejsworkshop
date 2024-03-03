var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;

var mongoose = require('mongoose')
var db = mongoose.connection

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var instructorsRouter = require('./routes/instructors');
var studentsRouter = require('./routes/students');
var classesRouter = require('./routes/classes')
var app = express();

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
  app.use(passport.initialize());
  app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instructors', instructorsRouter);
app.use('/students',studentsRouter)
app.use('/classes',classesRouter)

module.exports = app;
