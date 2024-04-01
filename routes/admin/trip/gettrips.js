const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const tripcon = require('../../../controller/admin/trip/gettrip') ;

router.get('/getcustumers/:id' , tripcon.getcustumers)


router.post('/gettripisavailable' ,isorg, tripcon.gettripisavailable)

router.post('/filtertripbynumberbus' ,isorg, tripcon.filtertripbynumberbus)


module.exports = router;
