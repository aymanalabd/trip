const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const buscon = require('../../../controller/admin/trip/addbus') ;

router.post('/addbus' ,isorg, buscon.addbus);

router.put('/updatebus/:id' , buscon.updatebus);


router.get('/getbuses' ,isorg, buscon.getbuses);

router.get('/gettypebus' , buscon.getbuses);



router.delete('/deletebus/:id' , buscon.deletebus);




 
module.exports = router;
