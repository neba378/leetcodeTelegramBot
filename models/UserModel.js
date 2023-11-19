const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: Number,
    firstName: String, 
    lastName: String,
    username: String,

    solved: Number,
    qList: {
        type: Object,
        default: {},
      },
    day: Number,
    createdAt: Date,

})


module.exports = mongoose.model("Users", userSchema)
