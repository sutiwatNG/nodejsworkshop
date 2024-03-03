var express = require('express');
var router = express.Router();

//Connect DB
var mongodb=require('mongodb');
var db=require('monk')('localhost:27017/ProjectDB');

//Upload
var multer=require('multer');

var storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images')
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+".jpg")
  }
})

var upload = multer({
  storage: storage
});

/* GET home page. */
router.get('/projects', function(req, res, next) {
  var projects = db.get('Project')
  projects.find({},{},function(err,project){
    res.render('adminproject',{projects:project})
  })
});

router.get('/projects/add', function(req, res, next) {
  res.render("addproject")
});

router.get('/projects/edit/:id', function(req, res, next) {
  var projects = db.get('Project')
  projects.find(req.params.id,{},function(err,project){
    res.render('editproject',{
      projects:project
    })
  })
});

router.post('/projects/delete/', function(req, res, next) {
  var projects = db.get('Project')
  projects.remove({
    _id:req.body.id
  })
  res.redirect("/admin/projects")
});

router.post('/projects/edit',upload.single("image"), function(req, res, next) {
  var projects = db.get('Project')
  //มีการแก้ไขและอัพโหลดรูปภาพ
  if (req.file) {
    var projectimage = req.file.filename
    projects.update({
      _id:req.body.id
    },{
      $set:{
        name:req.body.name,
        description:req.body.description,
        date:req.body.date,
        image:projectimage
      }
    },function(err,success){
      if(err){
        res.send(err)
      }else{
        res.location('/admin/projects')
        res.redirect('/admin/projects')
      }
    })
  }else{
   
    projects.update({
      _id:req.body.id
    },{
      $set:{
        name:req.body.name,
        description:req.body.description,
        date:req.body.date
      }
    },function(err,success){
      if(err){
        res.send(err)
      }else{
        res.location('/admin/projects')
        res.redirect('/admin/projects')
      }
    })
  }

});

router.post('/projects/add',upload.single("image"), function(req, res, next) {
  var projects = db.get('Project')
  if (req.file) {
    var projectimage = req.file.filename
  }else{
    var projectimage = "No Image"
  }
  projects.insert({
    name:req.body.name,
    description:req.body.description,
    date:req.body.date,
    image:projectimage
  },function(err,success){
    if(err){
      res.send(err)
    }else{
      res.location('/admin/projects')
      res.redirect('/admin/projects')
    }
  })
});
module.exports = router;
