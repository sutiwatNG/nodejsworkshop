//model
var bcrypt = require('bcryptjs')
//ใช้งาน mongoose
var mongoose = require('mongoose')
//เชื่อมต่อไปยัง mongoDB
var mongoDB = 'mongodb://localhost:27017/LoginDB'
mongoose.connect(mongoDB).catch(err=>console.log(err))

var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect  Error'))

//create schema
let userSchema = mongoose.Schema({
    name:String,
    password:String,
    email:String
})


let User = mongoose.model("user",userSchema)

module.exports = User

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash
                newUser.save(callback)
        })
    })

}
module.exports.getUserById = function(id,callback) {
    User.findById(id,callback)
}
module.exports.getUserByname = function(name,callback) {
    var query = {
        name:name
    }
    User.findOne(query,callback)
}

module.exports.comparePassword = function(password,hash,callback) {
        bcrypt.compare(password,hash,function(err,isMatch) {
            callback(null,isMatch)
        })
}