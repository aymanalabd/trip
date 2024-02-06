const custumer = require('../controller/custumer');
const isauth = require('../middleware/isauth');
const isorg = require('../middleware/isorg');
const express = require('express');
const router = express.Router();

const tripcon = require('../controller/trip') ;


router.post('/addtrip' ,isorg, tripcon.addtrip);
router.get('/gettrip/:id' , tripcon.getinfotrip);

router.get('/gettrip' ,isorg, tripcon.getall)
router.post('/updatetrip/:id' ,isorg, tripcon.updatetrip);

module.exports = router
