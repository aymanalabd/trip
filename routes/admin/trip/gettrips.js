const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const tripcon = require('../../../controller/admin/trip/gettrip') ;



router.post('/gettripisavailable' ,isorg, tripcon.gettripisavailable)

router.get('/gettripsavailable' ,isorg, tripcon.gettripsavailable)
router.get('/gettripscurrent' ,isorg, tripcon.gettripscurrent)



router.post('/gettripisfinished' ,isorg, tripcon.gettripisfinished)

router.get('/getalltripfinished' ,isorg, tripcon.getalltripfinished)


router.get('/getonetrip/:id' , tripcon.getonetrip)





router.post('/filtertripbynumberbus' ,isorg, tripcon.filtertripbynumberbus)

router.post('/filtertripbynumberbusonly' ,isorg, tripcon.filtertripbynumberbusonly)



module.exports = router;
