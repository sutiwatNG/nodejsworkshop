//ใช้งาน mongoose
var bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
//เชื่อมต่อไปยัง mongoDB
var mongoDB = 'mongodb://localhost:27017/ElerningDB'
mongoose.connect(mongoDB).catch(err=>console.log(err))

var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect  Error'))

var classSchema = mongoose.Schema({
    class_id:String,
    title:String,
    description:String,
    img_url:String,
    instructor:String,
    lesson:[{
        lesson_number:Number,
        lesson_title:String,
        lesson_body:String

    }]
})

let Classes = mongoose.model("classes",classSchema)

module.exports = Classes

module.exports.getClasses=function(callback,limit){
    Classes.find(callback).limit(limit)
}

module.exports.getClassID=function(class_id,callback){
    var quary ={
        class_id:class_id
    }
    Classes.findOne(quary,callback)
}

module.exports.saveNewClass = function(newClass,callback){
    newClass.save(callback)
}

module.exports.addLesson = function(info, callback) {
    lesson_number = info["lesson_number"]
    lesson_title = info["lesson_title"]
    lesson_body = info["lesson_body"]
    class_id = info["class_id"]

    var query = {
        class_id: class_id
      }

    Classes.findOneAndUpdate(
        query,{
        $push:{
          "lesson":{
            lesson_number:lesson_number,
            lesson_title:lesson_title,
            lesson_body:lesson_body
          }
        }
      },{
        safe:true,
        upsert:true
      },callback)
  }
