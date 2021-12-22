const express = require('express');
const { loginView, userLogin } = require('../controllers/loginController');
const { dashView } = require('../controllers/dashboardController');
const { userView, userDataTable, createUser, updateUser, getUser} = require('../controllers/userController');
const { employeeView, employeeDataTable, deleteEmployee, getEmployee, downloadCsvEmployee} = require('../controllers/employeeController');
const { requestView, requestDataTable, getRequest, downloadExcelRequest, downloadCsvRequest, downloadJsonRequest} = require('../controllers/requestController');
const { resultView, resultDataTable, getResult} = require('../controllers/resultController');
const router = express.Router();
const { check } = require('express-validator')
const User = require("../models/User");


let sess;
router.get('/',function(req,res){
    sess=req.session;
    sess.username;
    if(sess.username) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/login');
});


router.get('/login', loginView);


router.post('/login/auth', [
  check('username').notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required')
], userLogin);



router.get('/dashboard', dashView);


router.get('/user', userView);

router.get('/user/:id', getUser);

router.post('/user/datatable', userDataTable);

  
router.post('/user/create', [
  [
      check('userName').notEmpty().withMessage('Username is required').custom(async function(value){
    var user = await User.find({Username:value})
    return user.length == 0;
       }).withMessage("Username already taken."),
      check('fullName').notEmpty().withMessage('Full Name is required'),
      check('password').notEmpty().withMessage('Password is required').custom((value, { req }) => {
          if (value === req.body.passwordConfirmation) {
            return true;
          } else {
            return false;
          }
        })
        .withMessage("Password Confirmation don't match.")
  ]
], createUser);

router.post('/user/update', [
  [
      check('userName').notEmpty().withMessage('Username is required').custom(async function(value){
    var user = await User.find({Username:value})
    return user.length == 1;
       }).withMessage("Username is not exist."),
      check('fullName').notEmpty().withMessage('Full Name is required'),
      check('isActive').notEmpty().withMessage('Status is required'),
  ]
], updateUser);



router.get('/employee', employeeView);

router.get('/employee/:id', getEmployee);

router.post('/employee/datatable', employeeDataTable);


router.post('/employee/delete', deleteEmployee);
router.get('/emp/downloadCsv', downloadCsvEmployee);


router.get('/request', requestView);

router.get('/request/:id', getRequest);

router.post('/request/datatable', requestDataTable);

router.get('/req/downloadExcel', downloadExcelRequest);
router.get('/req/downloadCsv', downloadCsvRequest);
router.get('/req/downloadJson', downloadJsonRequest);


router.get('/result', resultView);

router.get('/result/:id', getResult);

router.post('/result/datatable', resultDataTable);



module.exports = router;