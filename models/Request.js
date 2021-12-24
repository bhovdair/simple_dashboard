const mongoose = require("mongoose");
var dataTables = require('mongoose-datatables')
const RequestSchema = new mongoose.Schema({
  absenId: {
    type: String,
  },
  MD5Image: {
    type: String,
  },
  NamaKaryawan: {
    type: String,
  },
  NIK: {
    type: String,
  },
  UNIQ: {
    type: String,
  },
  Username: {
    type: String,
  },
  timestamp: {
    type: Date
  }
});

RequestSchema.plugin(dataTables)


const Request = mongoose.model("Request", RequestSchema);
module.exports = Request;