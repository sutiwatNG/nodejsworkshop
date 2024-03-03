var express = require('express');
var router = express.Router();
var Classes = require('../model/classes')



/* GET home page. */
router.get('/',enSureAuthenticated, function(req, res, next) {
  Classes.getClasses(function(err,classes){
    res.render('index', { classes: classes });
  })
});
function enSureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }else{
      res.redirect('/users/login');
}
}
module.exports = router;
