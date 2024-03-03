var bcrypt = require('bcryptjs')
//ใช้งาน mongoose
var mongoose = require('mongoose')
//เชื่อมต่อไปยัง mongoDB
var mongoDB = 'mongodb://localhost:27017/ElerningDB'
mongoose.connect(mongoDB).catch(err=>console.log(err))

var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect  Error'))

var userSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    type:String
})

let User = mongoose.model("users",userSchema)

module.exports = User

module.exports.saveStudent=function(newUser,newStudent,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash
                newUser.save(callback)
                newStudent.save(callback)
        })
    })
}

module.exports.saveInstructor=function(newUser,newInstructor,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash
                newUser.save(callback)
                newInstructor.save(callback)
        })
    })
}
module.exports.getUserById = function(id,callback) {
    User.findById(id,callback)
}
module.exports.getUserByname = function(username,callback) {
    var query = {
        username:username
    }
    User.findOne(query,callback)
}

module.exports.comparePassword = function(password,hash,callback) {
        bcrypt.compare(password,hash,function(err,isMatch) {
            callback(null,isMatch)
        })
}

