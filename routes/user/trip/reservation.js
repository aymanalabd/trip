
const isauth = require('../../../middleware/isauth');
const reservecontoller = require('../../../controller/user/trip/reservation') ;

const express = require('express');
const router = express.Router();

router.post('/reservation/:id',isauth , reservecontoller.reservation);

router.post('/canclereserve/:id',isauth , reservecontoller.cancelreserve);



router.get('/getreserveispaid',isauth , reservecontoller.getreserveispaid);

router.get('/getreserveisnotpaid',isauth , reservecontoller.getreserveisnotpaid);





module.exports = router;



