const express = require('express');
const router = express.Router();



const {settingUsername}= require(`../controller/settingusername.js`)
const { sendotp } = require('../controller/sendotp');;
const { verifyEmail } = require('../controller/verifyemail');
const { handlelogin } = require('../controller/login');

router.post(`/settingusername`,settingUsername);
router.post('/send_otp', sendotp);
router.post('/verifyemail',verifyEmail);
router.post('/login', handlelogin);
module.exports = router;