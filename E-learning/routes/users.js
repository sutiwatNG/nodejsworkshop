var express = require('express');
var router = express.Router();
var User = require('../model/user')
var Student = require('../model/student')
var Instructor = require('../model/instructor')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const{check,validationResult} = require('express-validator')

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('users/register')
});




router.get('/login', function(req, res, next) {
  res.render('users/login')
});

router.get('/logout', function(req, res,next) {
  req.logout(function(err) {
  if (err) { return next(err); }
  res.redirect('/users/login');
  })
});

router.post('/login',passport.authenticate('local',{
  failureRedirect:'/users/login',
  failureFlash:true
}) , function(req, res) {
  let usertype = req.user.type
res.redirect('/'+usertype+'s/classes')
});

passport.serializeUser(function(user,done) {
done(null,user.id)
})
passport.deserializeUser(function(id,done) {
User.getUserById(id,function(err,user) {
  done(err,user)
})
})

passport.use(new LocalStrategy(function(username,password,done) {
User.getUserByname(username,function(err,user){
    if(err) throw error
    if (!user) {
      //ไม่พบผู้ใช้งาน
      return done(null,false)
    }else{
      return done(null,user)
    }
User.comparePassword(password,user.password,function(err, isMatch){
      if(err) throw err
      if (isMatch) {
        return done(null,user)
      }else{
        return done(null,false)
      }
})
})

}))

router.post('/register', [
  check('email', 'กรุณาป้อนอีเมล').isEmail(),
  check('fname', 'กรุณาป้อนชื่อจริงของท่าน').not().isEmpty(),
  check('lname', 'กรุณาป้อนนามสกุลของท่าน').not().isEmpty(),
  check('username', 'กรุณาป้อน Username').not().isEmpty(),
  check('password', 'กรุณาป้อนรหัสผ่าน').not().isEmpty()
], function(req, res, next) {
  const result = validationResult(req);
  let errors = result.errors;
  //Validation Data
  if (!result.isEmpty()) {
    //Return error to views
    res.render('users/register', {
      errors: errors
    })
  } else {
    //Insert  Data
    let type = req.body.type
    let newUser = new User({
      username:req.body.username,
      password:req.body.password,
      email:req.body.email,
      type:type
    });
    if (type=="student") {
      let newStudent = new Student({
        username:req.body.username,
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email
      })
      User.saveStudent(newUser,newStudent,function(err,user){
        if(err) throw err
  })
    }else{
      let newInstructor = new Instructor({
        username:req.body.username,
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email
      })
      User.saveInstructor(newUser,newInstructor,function(err,user){
        if (err) throw err
      })
    }
    res.redirect('/');
  }
})


module.exports = router;
