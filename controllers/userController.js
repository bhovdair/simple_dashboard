const User = require("../models/User");
const bcrypt = require("bcryptjs");


const { validationResult } = require('express-validator')

// const validateNewUser = () => {
//     check('userName').notEmpty().withMessage('Username is required'),
//     check('fullName').notEmpty().withMessage('Full Name is required'),
//     check('password').notEmpty().withMessage('Password is required'),
//     check('password').notEmpty().withMessage('Password is required'),
//     check('passwordConfirmation').notEmpty().withMessage('Password Confirmation is required')
//   }

const createUser = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    const err = validationResult(req);
    const { userName, fullName, password } = req.body;

    try {

        if (!err.isEmpty()) {
            message = "Invalid form input.";
            throw new Error(message);
        }

        var salt = bcrypt.genSaltSync(10);
        // hash password dengan salt 
        var hash = bcrypt.hashSync(password, salt);

        const Data = new User({
            Username: userName,
            FullName: fullName,
            Password: hash,
        });


        await Data.save();
        status = true;
        message = "Insert data succeed.";
    } catch (error) {
        message = error.message;
    }

    return res.status(code).json({ status: status, message: message, errors: err.array() });

};

const updateUser = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    const err = validationResult(req);
    const { userName, fullName, isActive, modifiedBy } = req.body;

    try {
        if (!err.isEmpty()) {
            message = "Invalid form input.";
            throw new Error(message);
        }

        let Data = await User.findOne({ Username: userName });
        Data.FullName = fullName;
        Data.IsActive = isActive;
        Data.ModifiedBy = modifiedBy;
        Data.ModifiedOn = new Date();

        await Data.save();
        status = true;
        message = "Update data succeed.";
    } catch (error) {
        message = error.message;
    }

    return res.status(code).json({ status: status, message: message, errors: err.array() });

};

const getUser = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    let data = {};
    let id = req.params.id;

    try {
        let Data = await User.findOne({ _id: id });
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

const userDataTable = function (req, res) {
    User.dataTables({
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



const userView = (req, res) => {

    
    let sess = req.session;
    sess.username;
    if (!sess.username) {
        return res.redirect('/login');
    }

    res.render("user", {
        pageName: "User",
        currentMenu: 'user'
    });
}

module.exports = {
    userView,
    userDataTable,
    createUser,
    updateUser,
    getUser
};