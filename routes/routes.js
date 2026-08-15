const express = require(`express`)

const {createchatroom}= require(`../controller/createchatroom.js`)

const router = express.Router()


router.post(`/createchatroom`,createchatroom)

module.exports= {router};
