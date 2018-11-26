const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  answer:{
    type:String
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  securityLevel: {
    type:String,
    default:'private',
    enum: ['secret', 'private','public']
  }
},{
  timestamps:true
})

const Result = mongoose.model("Result", ResultSchema)

module.exports = Result;