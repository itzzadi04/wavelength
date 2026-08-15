const express = require('express');
const router = express.Router();


const {settingUsername}= require(`../controller/settingusername.js`)
const { sendotp } = require('../controller/sendotp');;
const { verifyEmail } = require('../controller/verifyemail');


router.post(`/settingusername`,settingUsername);
router.post('/send_otp', sendotp);
router.post('/verifyemail',verifyEmail);

module.exports = router;