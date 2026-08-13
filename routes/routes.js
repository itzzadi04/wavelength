const express = require(`express`)

const {settingusername}= require(`../controller/settingusername.js`)
const {createchatroom}= require(`../controller/createchatroom.js`)

const router = express.Router()

router.post(`/settingusername`,settingusername)
router.post(`/createchatroom`,createchatroom)

module.exports= {router};
