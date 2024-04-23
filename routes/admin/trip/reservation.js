const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const reservecon = require('../../../controller/admin/trip/reservation') ;



router.put('/reservation/:id1/:id2' , reservecon.reservation)

router.put('/reservebyadmin/:id' ,isorg, reservecon.reservebyadmin)


router.put('/canclereservation/:id1/:id2' , reservecon.canclereserve)




module.exports = router;
