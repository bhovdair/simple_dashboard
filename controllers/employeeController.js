const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");



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
        currentMenu: 'employee'
    });
}

module.exports = {
    employeeView,
    employeeDataTable,
    deleteEmployee,
    getEmployee
};