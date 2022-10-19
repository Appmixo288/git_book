import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Please Enter WhatUp Mobile Number"],
    unique:true,
    trim: true,
  },
  type_of_user:{
    type:String,
    enum: ["influencer", "brand"],
  },
  first_name:{
    type:String,
    trim: true
  },
  last_name:{
    type:String,
    trim: true
  },
  is_facebook:{
    type: Boolean,
    default: false, 
  },
  is_update:{
    type:Boolean,
    default:false
  },
  cover_image:{
    type:String,
  },
  profile_image:{
    type:String,
  },
  thumbnail_image:{
    type:String,
  },
  cost_update_time:{
    type:Number,
    default:0
  },
  brand_update_time:{
    type:Number,
    default:0
  },
  facebook_info:{
    email: {
      type:String,
      unique:false,
      trim: true,
    },
    name: {
      type: String,
      maxlength: [30, "Name can not exceed 30 charcter"],
      minlength: [4, "Name should have more the 4 charcter"],
    },
    social_id: {
      type:Number,
      require: true,
      trim: true,
    },
    facebook_followers: {
      type:Number,
    },
    profile_pic:{
      type:String
    },
  },
  is_instagram:{
    type: Boolean,
    default: false,
  },
  instagram_info:{
    name: {
      type: String,
      maxlength: [30, "Name can not exceed 30 charcter"],
      minlength: [4, "Name should have more the 4 charcter"],
    },
    social_id: {
      type: Number,
      require: true,
    },
    instagram_followers: {
      type:Number,
    },
    instagram_following: {
      type:Number,
    },
    profile_pic:{
      type:String
    },
    external_url:{
      type:String
    }
  },
  facebook_username:{
    type:String,
    trim: true
  },
  facebook_followers:{
    type:Number,
    default:0
  },
  instagram_username:{
    type:String,
    trim: true
  },
  instagram_followers:{
    type:Number,
    default:0
  },
  youtube_username:{
    type:String,
    trim: true
  },
  youtube_followers:{
    type:Number,
    default:0
  },
  following:[{
      type:mongoose.Schema.ObjectId,
      ref: "User"
  }],
  followers:[{
    type:mongoose.Schema.ObjectId,
    ref: "User",
}],
  following_count:{
    type:Number
  },
  followers_count:{
    type:Number
  },
  status: {
    type: String,
    default: "pending",
    required: true,
    enum: ["pending","suspended","approved"],
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_completed_profile: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    trim: true,
  },
  admin_token: {
    type: String,
    trim: true,
  },
},{
  timestamps: true,
});

// userSchema.pre('deleteOne', function (next) {
//   console.log("delete")
//   const userId = this.getQuery()['_id'];
//   console.log("userid",userId ,this.following)
//   try {
//     this?.following.remove(userId)
//     // User.deleteOne({ following: userId }, next);
//   } catch (err) {
//     next(err);
//   }
// });

//JWT token
// userSchema.methods.getJWTToken = async function (device) {
//   if(device)
//   {
//     const tokens=jwt.sign({ id: this._id },process.env.JWT_SECERT,{ expiresIn: '1d' }); 
//     console.log("tokens",tokens)
//     this.admin_token=tokens
//     await this.save()
//     return tokens ;
//   }
//   const tokens=jwt.sign({ id: this._id },process.env.JWT_SECERT,{ expiresIn: '365d' }); 
//   this.token=tokens
//   await this.save()
//   return tokens ;
// };

const adminUser=mongoose.model("User", userSchema);
export default adminUser;  
