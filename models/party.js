const mongoose = require("mongoose");

//Party Schema
const partySchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    unique: true
  },
  president:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
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
  approvalList:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  joinType: {
    type: String,
    enum: ['open', 'closed', 'approval'],
    default: 'open'
  },
  description: String,
  image: String,
  prestige: {
    type:Number,
    default:0
  },
  partyLine:[]
});

module.exports = mongoose.model("Party", partySchema)