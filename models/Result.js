const mongoose = require("mongoose");
var dataTables = require('mongoose-datatables')
const ResultSchema = new mongoose.Schema({
  NIK: {
    type: String,
  },
  UNIQ: {
    type: String,
  },
  responseLog: {
    type: String,
  },
  timestamp: {
    type: String
  }
});

ResultSchema.plugin(dataTables)


const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;