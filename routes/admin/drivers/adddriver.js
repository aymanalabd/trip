const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const drivercon = require('../../../controller/admin/drivers/adddriver') ;

router.post('/adddrivers' ,isorg , drivercon.adddrivers);

router.delete('/deletedriver/:id' , drivercon.deletedriver);

router.get('/getalldrivers' , isorg,drivercon.getalldrivers );


router.get('/getdriverisavailable' , isorg,drivercon.getdriverisavailable);







 
module.exports = router;
