const isauth = require('../../../middleware/isauth');
const isdriver = require('../../../middleware/isdriver');
const express = require('express');
const router = express.Router();

const getinfodriver = require('../../../controller/admin/drivers/getinfodriver') ;

router.get('/getinfodriver' ,isdriver , getinfodriver.getinfodriver);








 
module.exports = router;
