const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//User Schema Setup
const UserSchema = new mongoose.Schema({
  username:{
      type: String,
      required: true,
      unique: true
    },
  password:{
      type:String,
      required:true
    },
  image: String,
  settings: [],
  email:{
    type:String,
    default: undefined
  },
  authLevel: {
      type:String,
      enum: ['user', 'subscriber', 'admin', 'founder'],
      default: 'user'
    },
  party:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Party"
    },
  authored:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Question"
    }
  ],
  // questions the user has answered
  questions:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question"
      }
    ],
  results:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Result"
    }
  ],
  coins:{
      type:Number,
      default: 20
    },
  experience:{
      type:Number,
      default: 0
    },
  inventory:[
      {
       type:mongoose.Schema.Types.ObjectId,
       ref: "Item"
      }
    ],
  avatar:{
      type:String,
      default: "https://images.unsplash.com/photo-1488953348951-d465fedacbc3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=175168216823bb306a93b94907928289&auto=format&fit=crop&w=616&q=80"
    },
  age:{
      type:Number,
      default: 0
    },
  race:{
      type:String,
      enum: ['Native American', 'African American', 'White American', 'Mixed Northern American', 'European', 'Hispanic', 'South American', 'East Asian', 'African', 'Middle Eastern', 'Mixed or Multiple Races', 'Other', 'Not Specified'],
      default: 'Not Specified'
    },
  income:{
      type:Number,
      default: 0
    },
  gender:{
      type:String,
      enum: ['Male', 'Female', 'Trans-Male', 'Trans-Female', 'Neutral', 'Nonconforming', 'Other', 'Not Specified'],
      default: 'Not Specified'
    },
  education:{
      type:String,
      enum: ['Doctorate', 'Masters', 'Bachelors', 'High School', 'Less than High School', 'Not Specified'],
      default: 'Not Specified'
    },
  location: {
    type:String,
    enum: [ 'Not Specified', 'Non-USA' ,'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ],
    default: 'Not Specified'
  },
  familySize:{
      type:Number,
      default: 0
    }
},{
  timestamps:true
})

UserSchema.pre("save", async function(next){
  try{
    if(!this.isModified("password")){
      return next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next()
  } catch(err){
    return next(err);
  }
})

UserSchema.methods.comparePassword = async function(candidatePassword, next){
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch(err){
    return next(err);
  }
}

const User = mongoose.model("User", UserSchema)

module.exports = User;