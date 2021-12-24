const Result = require("../models/Result");



const getResult = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    let data = {};
    let id = req.params.id;

    try {
        let Data = await Result.findOne({ id: id });
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

const resultDataTable = function (req, res) {
    Result.dataTables({
        limit: req.body.length,
        skip: req.body.start,
        order: req.body.order,
        columns: req.body.columns,
        search: {
            value: req.body.search.value,
            fields: [ 'UNIQ', 'timestamp', 'responseLog', 'NIK']
          }
    }).then(function (table) {
        res.json({
            data: table.data,
            recordsFiltered: table.total,
            recordsTotal: table.total
        });
    });
};



const resultView = (req, res) => {

    
    let sess = req.session;
    sess.username;
    if (!sess.username) {
        return res.redirect('/login');
    }
    
    res.render("result", {
        pageName: "Result",
        currentMenu: 'result',
        userName : sess.username,
        fullName : sess.fullName,
    });
}

module.exports = {
    resultView,
    resultDataTable,
    getResult
};