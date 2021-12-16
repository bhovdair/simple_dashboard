const mongoose = require("mongoose");
var dataTables = require('mongoose-datatables')
const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique : true,
  },
  FullName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  IsActive:{
      type : Boolean,
      required: true,
      default : 1
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  CreatedBy: {
    type: String,
    default: "System",
  },
  ModifiedOn: {
    type: Date,
    default: null,
  },
  ModifiedBy: {
    type: String,
    default: null
  },
});

UserSchema.plugin(dataTables)


const User = mongoose.model("User", UserSchema);
module.exports = User;