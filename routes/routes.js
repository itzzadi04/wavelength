const express = require(`express`)
const router = express.Router()

const {createchatroom}= require(`../controller/createchatroom.js`)

const { checkauth } = require('../middleware/checkauth');



   router.post(`/createchatroom`, checkauth, createchatroom)

module.exports= {router};
