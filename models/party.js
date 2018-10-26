const mongoose = require("mongoose");

//Party Schema
const partySchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    unique: true
  },
  officers:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  members:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  joinType:String,
  description: String,
  image: String,
  prestige: Number,
  partyLine:[]
});

module.exports = mongoose.model("Party", partySchema)