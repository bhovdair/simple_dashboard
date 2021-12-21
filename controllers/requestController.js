const Request = require("../models/Request");

const excel = require("exceljs");
const CsvParser = require("json2csv").Parser;

const downloadExcelRequest = (req, res) => {
  Request.find().then((objs) => {
    let requests = [];
    objs.forEach((obj) => {
      requests.push({
        id: obj.id,
        absenId: obj.absenId,
        MD5Image: obj.MD5Image,
        // NamaKaryawan: obj.NamaKaryawan,
        NIK: obj.NIK,
        timestamp: obj.timestamp,
        UNIQ: obj.UNIQ,
        Username: obj.Username,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Attendance Request");

    worksheet.columns = [
      { header: "Id", key: "id" },
      { header: "Absen ID", key: "absenId" },
      // { header: "MD5Image", key: "MD5Image" },
      { header: "Nama Karyawan", key: "NamaKaryawan" },
      { header: "NIK", key: "NIK" },
      { header: "timestamp", key: "timestamp" },
      { header: "UNIQ", key: "UNIQ" },
      { header: "Username", key: "Username" },
    ];

    // Add Array Rows
    worksheet.addRows(requests);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "requests.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

const downloadCsvRequest = (req, res) => {
  Request.find().then((objs) => {
    let requests = [];
    objs.forEach((obj) => {
      requests.push({
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
    const csvData = csvParser.parse(requests);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=requests.csv");

    res.status(200).end(csvData);
  });
};


const getRequest = async (req, res) => {
  let status = false;
  let message = "";
  let code = 200;
  let data = {};
  let id = req.params.id;

  try {
    let Data = await Request.findOne({ id: id });
    if (data == null) {
      message = "Data not found.";
      throw new Error(message);
    }
    data = Data;
    status = true;
    message = "Data found.";
  } catch (error) {
    message = error.message;
  }

  return res.status(code).json({ status: status, message: message, data: data });

};

const requestDataTable = function (req, res) {
  Request.dataTables({
    limit: req.body.length,
    skip: req.body.start,
    search: {
      // value: req.body.search.value,
      // fields: ['username']
    },
    //   find:{ $and:[ 
    //       {'UNIQ': req.body.uniq}, 
    //       {'absenId': req.body.absenId} ,
    //       {'NamaKaryawan': req.body.employeeName} ,
    //       {'Username': req.body.username} ,
    //       {'NIK': req.body.nik} ,
    //     ]},
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



const requestView = (req, res) => {


  let sess = req.session;
  sess.username;
  if (!sess.username) {
    return res.redirect('/login');
  }

  res.render("request", {
    pageName: "Request",
    currentMenu: 'request',
    userName : sess.username,
    fullName : sess.fullName,
  });
}

module.exports = {
  requestView,
  requestDataTable,
  getRequest,
  downloadExcelRequest,
  downloadCsvRequest
};