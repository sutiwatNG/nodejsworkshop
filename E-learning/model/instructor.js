//ใช้งาน mongoose

var mongoose = require('mongoose')
//เชื่อมต่อไปยัง mongoDB
var mongoDB = 'mongodb://localhost:27017/ElerningDB'
mongoose.connect(mongoDB).catch(err=>console.log(err))

var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect  Error'))

var instructorSchema = mongoose.Schema({
    username:String,
    fname:String,
    lname:String,
    email:String,
    classes:[{
      class_id:String,
      class_title:String
    }]
})

let Instructor = mongoose.model("instructors",instructorSchema)

module.exports = Instructor

module.exports.getInstructorsByUserName = function(username, callback) {
  var query = {
    username: username
  }
  Instructor.findOne(query, callback);
}

module.exports.register = function(info, callback) {
  instructor_user = info["instructor_user"]
  class_id = info["class_id"]
  class_title = info["class_title"]
  var query = {
    username: instructor_user
  }
  Instructor.findOneAndUpdate(
    query,{
      $push:{
        "classes":{
          class_id:class_id,
          class_title : class_title
        }
      }
    },{
      safe:true,
      upsert:true
    },callback)
}

