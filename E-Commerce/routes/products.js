var express = require('express');
var router = express.Router();

var {check,validationResult} = require('express-validator')

//Connect DB
var mongodb=require('mongodb');
var db=require('monk')('localhost:27017/E-CommerceDB');

/* GET home page. */
router.get('/add', function(req, res, next) {
 var categories = db.get('categories')
 categories.find({},{},function(err, category){
    res.render('addproduct',{
        categories:category
    })
 })
});

router.get('/show/:id', function(req, res, next) {
    var categories = db.get('categories');
    var products = db.get('products')
    products.find(req.params.id,{},function(err,product){
    categories.find({},{},function(err,category){
      res.render('show',{
        products:product,
        categories:category
      })
    })
  })
  });

router.get('/show/', function(req, res, next) {
    var categories = db.get('categories');
    var products = db.get('products')
    var categoryname = req.query.category
    if (categoryname) {
        products.find({category:categoryname },{},function(err,product){
            categories.find({},{},function(err,category){
              res.render('searchproduct',{
                products:product,
                categories:category
        })
       })
     })
    }
});  

router.post('/cart/', function(req, res, next) {
    var products = db.get('products')
    var product_id = req.body.product_id
    req.session.cart = req.session.cart || {}
    var cart = req.session.cart //ตะกร้าสินค้า
    products.find({
        _id:product_id
     },{},function(err,product){
        //กรณีซื้อชิ้้นเดิมมากกว่า 1 ชิ้น
        if(cart[product_id]){
            cart[product_id].qty++
        }else{
            //ซื้อครั้งแรก
            product.forEach(function(item){
                cart[product_id] = {
                    item:item._id,
                    title:item.name,
                    price:item.price,
                    qty:1
                }
            })
           } 
           res.redirect('/products/cart')
    }) 
    
}); 

router.get('/cart/', function(req, res, next) {
    var cart = req.session.cart//ตะกร้าสินค้า
    var displayCart = {items:[],total:0}
    var total =  0
    for (item in cart) {
        displayCart.items.push(cart[item])
        total += (cart[item].qty * cart[item].price)
    }
    displayCart.total=total
    res.render('cart',{cart:displayCart})
}); 

router.post('/add', [
    check('name', 'กรุณาป้อนชื่อสินค้า').not().isEmpty(),
    check('description', 'กรุณาป้อนรายละเอียด').not().isEmpty(),
    check('img', 'กรุณาใส่รูปภาพ').not().isEmpty(),
    check('price', 'กรุณาป้อนราคา').not().isEmpty(),
  ], function(req, res, next){
    var result = validationResult(req)
    var errors = result.errors
    var categories = db.get('categories')
    if(!result.isEmpty()){
        categories.find({},{},function(err, category){
        res.render('addproduct',{
            categories:category,
            errors:errors
        })
    })
    }else {
        //บันทึกข้อมูล
    var product = db.get('products');
    product.insert({
        name:req.body.name,
        description:req.body.description,
        img:req.body.img,
        price: parseFloat(req.body.price),
        category:req.body.category
    },function(err,success){
        if (err) {
            res.send(err)
        }else{
            res.location('/')
            res.redirect('/')
        }
    })  
    }
  })

module.exports = router;
 