const mongoose = require("mongoose");
var dataTables = require('mongoose-datatables')
const EmployeeSchema = new mongoose.Schema({
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

EmployeeSchema.plugin(dataTables)


const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;