const mongoose = require("mongoose");
const validator = require("validator");

const tagSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please Enter Your tag Name"],
    unique: true,
  },
  status: {
    type: String,
    default: "pending",
    required: true,
    enum: ["pending", "suspended","approved"],
  },
},
{ 
    timestamps: true
})

 module.exports = mongoose.model("tag", tagSchema);