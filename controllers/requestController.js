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

const downloadJsonRequest = (req, res) => {
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

    const fs = require('fs');
    let data = JSON.stringify(requests);
    fs.writeFileSync('request.json', data);

    return res.status(200).end();
  });
};

const getRequest = async (req, res) => {
  let status = false;
  let message = "";
  let code = 200;
  let data = {};
  let id = req.params.id;

  try {
    let Data = await Request.find(
      // {
      //   $where: function () {
      //       return (new Date(this.timestamp) >= new Date('2021-12-01') && new Date(this.timestamp) <= new Date('2021-12-24'))
      //   }
      // }
      // {timestamp : { $gt: new Date('2021-12-01T23:10:40.000+00:00')}}
      // {timestamp: { $dateToString: {  date: new Date(), format: "%Y-%m-%d" } }},
      // {timestamp : new Date('2021-12-15T23:10:40.000+00:00')}
    );
    // let Data = await Request.findOne({ id: id });
    if (Data == null) {
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
  let gte = "";
  let lte = "";
  if(req.body.timeStart){
    gte = new Date(req.body.timeStart);
  }else{
    gte = new Date('2000-01-01');
  }
  
  if(req.body.timeEnd){
    lte = new Date(req.body.timeEnd);
  }else{
    lte = new Date();
  }
  
  // console.log(req.body);
  // console.log(gte);
  // console.log(lte);
  console.log(req.query);
  Request.dataTables({
    limit: req.body.length,
    skip: req.body.start,
    search: {
      value: req.body.search.value,
      fields: [ 'UNIQ', 'absenId', 'NamaKaryawan', 'Username', 'NIK', 'timestamp']
    },
    find:{$and:
      [
        {'UNIQ':  { '$regex' : req.body.uniq, '$options' : 'i' }},
        {'absenId':  { '$regex' : req.body.absenId, '$options' : 'i' }},
        {'NamaKaryawan':  { '$regex' : req.body.employeeName, '$options' : 'i' }},
        {'Username':  { '$regex' : req.body.username, '$options' : 'i' }},
        {'NIK':  { '$regex' : req.body.nik, '$options' : 'i' }},
        // {'timestamp':  new Date('2021-12-01T23:10:40.000+00:00')},
        // {'timestamp':  { $gt: new Date('2021-12-01T02:26:05.000Z')}},
        // {
        //   '$where': function () {
        //       var docDate = new Date(this.timestamp);
        //       return (docDate >= new Date('2021-12-13') && docDate <= new Date('2021-12-14'))
        //   }
        // }
        // {
        //   function () {
        //       var docDate = new Date(this.timestamp);
        //       return docDate = new Date('2021-12-01T23:10:40.000+00:00')
        //       // return (docDate >= new Date('2021-12-01') && docDate <= new Date('2021-12-25'))
        //       // return (docDate >= new Date('2021-12-01') && docDate <= new Date('2021-12-25'))
        //   }
        // }
      ]
    },
    find:{$and:[
      {'timestamp':  { $gt: gte}},
      {'timestamp':  { $lt: lte}},
    ]},
    // find: {$and:[
    //   {
    //     where: function () {
    //         return (new Date(this.timestamp) >= new Date('2021-12-01') && new Date(this.timestamp) <= new Date('2021-12-12'))
    //     }
    //   }
    // ]},
    order: req.body.order,
    columns: req.body.columns
  }).then(function (table) {
    console.log(table);
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  });
};

const updateTimestamp = async (req, res) => {
  let status = false;
  let message = "";
  let code = 200;
  try {

    await Request.updateMany(
      // { IsUpdated: false},
      { $set: { IsUpdated: true } },
      { multi: true }
     )
      .then(result => {
        status = true;
        message = "Update data succeed.";
      })
      .catch(err => {
        message = "Update data failed.";
      });

  } catch (error) {
      message = error.message;
  }

  return res.status(code).json({ status: status, message: message});

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
  downloadCsvRequest,
  downloadJsonRequest,
  updateTimestamp
};