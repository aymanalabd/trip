const isauth = require('../../middleware/isauth');
const isorg = require('../../middleware/isorg');
const express = require('express');
const router = express.Router();

const tripcon = require('../../controller/trip/admin') ;

router.post('/addtrip' , tripcon.addtrip);


router.get('/getbusbyorg' ,isorg, tripcon.getbusbyorg)

module.exports = router;
