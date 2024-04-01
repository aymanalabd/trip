const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const tripcon = require('../../../controller/admin/trip/addtrip') ;

router.post('/addtrip' , tripcon.addtrip);

router.delete('/deletetrip/:id' , tripcon.deletetrip)

router.put('/updatetrip/:id' , tripcon.updatetrip)


router.get('/getbusbyorg' ,isorg, tripcon.getbusbyorg)

module.exports = router;
