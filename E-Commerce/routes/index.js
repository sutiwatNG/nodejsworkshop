var express = require('express');
var router = express.Router();

//Connect DB
var mongodb=require('mongodb');
var db=require('monk')('localhost:27017/E-CommerceDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  var categories = db.get('categories');
  var products = db.get('products')
  products.find({},{},function(err,product){
  categories.find({},{},function(err,category){
    res.render('index',{
      products:product,
      categories:category
    })
  })
})
});

module.exports = router;
