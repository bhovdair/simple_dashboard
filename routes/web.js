const express = require('express');
const { loginView, userLogin } = require('../controllers/loginController');
const { dashView } = require('../controllers/dashboardController');
const { userView, dataTable, createUser, updateUser, getUser} = require('../controllers/userController');
const router = express.Router();
const { check } = require('express-validator')
const User = require("../models/User");


router.get('/login', loginView);


router.post('/login/auth', [
  check('username').notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required')
], userLogin);



router.get('/dashboard', dashView);


router.get('/user', userView);

router.get('/user/:id', getUser);

router.post('/user/datatable', dataTable);

  
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




module.exports = router;