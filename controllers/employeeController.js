const Employee = require("../models/Employee");
const CsvParser = require("json2csv").Parser;

const downloadCsvEmployee = (req, res) => {
    Employee.find().then((objs) => {
      let employees = [];
      objs.forEach((obj) => {
        employees.push({
          id: obj.id,
          absenId: obj.absenId,
          // MD5Image: obj.MD5Image,
          NamaKaryawan: obj.NamaKaryawan,
          NIK: obj.NIK,
          timestamp: obj.timestamp,
          UNIQ: obj.UNIQ,
          Username: obj.Username,
        });
      });
  
      const csvFields = ["Id", "Absen ID", "Nama Karyawan", "NIK", "timestamp" , "UNIQ", "Username"];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(employees);
  
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
  
      res.status(200).end(csvData);
    });
  };
  


const deleteEmployee = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;

    try {
        await Employee.deleteOne({ id: req.body.id })
        status = true;
        message = "Delete data succeed.";
    } catch (error) {
        message = error.message;
    }

    return res.status(code).json({ status: status, message: message});

};

const getEmployee = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    let data = {};
    let id = req.params.id;

    try {
        let Data = await Employee.findOne({ id: id });
        if(data == null){
            message = "Data not found.";
            throw new Error(message);
        }
        data = Data;
        status = true;
        message = "Data found.";
    } catch (error) {
        message = error.message;
    }

    return res.status(code).json({ status: status, message: message, data : data});

};

const employeeDataTable = function (req, res) {
    Employee.dataTables({
        limit: req.body.length,
        skip: req.body.start,
        order: req.body.order,
        columns: req.body.columns
    }).then(function (table) {
        res.json({
            data: table.data,
            recordsFiltered: table.total,
            recordsTotal: table.total
        });
    });
};



const employeeView = (req, res) => {

    
    let sess = req.session;
    sess.username;
    if (!sess.username) {
        return res.redirect('/login');
    }
    
    res.render("employee", {
        pageName: "Employee",
        currentMenu: 'employee',
        userName : sess.username,
        fullName : sess.fullName,
    });
}

module.exports = {
    employeeView,
    employeeDataTable,
    deleteEmployee,
    getEmployee,
    downloadCsvEmployee
};