const { validationResult } = require('express-validator')
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sessions = require('express-session');

let sess;
const loginView = (req, res) => {
    sess = req.session;
    if (sess.username) {
        return res.redirect('/dashboard');
    }

    res.render("login", {
    });
}

// const loginValidator = () => {
//     return [
//       body('username').notEmpty().withMessage('username or email is required'),
//       body('password').notEmpty().withMessage('password is required')
//     ]
//   }

const userLogin = async (req, res) => {
    let status = false;
    let message = "";
    let code = 200;
    const err = validationResult(req);
    const { username, password } = req.body;
    try {

        if (!err.isEmpty()) {
            message = "Invalid form input.";
            throw new Error(message);
        }

        let Data = await User.findOne({ Username: username });
        if (Data == null) {
            throw new Error("User not found.");
        }

        const validPassword = await bcrypt.compare(password, Data.Password);
        if (validPassword) {
            status = true;
            message = "Login succeed.";
            sess = req.session;
            sess.username = Data.Username;
        } else {
            message = "Login failed.";
        }

    } catch (error) {
        message = error.message;
    }

    return res.status(code).json({ status: status, message: message, errors: err.array() });
};

module.exports = {
    loginView,
    userLogin
};