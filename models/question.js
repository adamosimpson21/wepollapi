const mongoose = require("mongoose");
const User = require("./user")

//Schema Setup
const questionSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  questionContent: {
    type:String,
    required:true
  },
  rating: {
    type:Number,
    default: 100
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: {
    type:String,
    required:true
  },
  xpReward: {
    type:Number,
    default: 150
  },
  education: String,
  priority: {
    type:Number,
    required:true,
    default:0
  },
  tags: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Tag"
    }
  ],
  answerType:{
    type: String,
    default: 'single',
    enum: ['single', 'multiple', 'range']
  },
  answers: [
    {
      type:String
    }
  ],
  results:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Result"
    }
  ]
},{
  timestamps: true
})

questionSchema.pre("remove", async function(next){
  try{
    let user = await User.findById(this.author);
    user.authored.remove(this.id);
    await user.save()
    return next();
  } catch(err){
    return next(err);
  }
})

module.exports = mongoose.model("Question", questionSchema);