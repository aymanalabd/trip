const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const blockcon = require('../../../controller/admin/customers/block') ;


router.post('/block/:id' ,isorg, blockcon.block);
router.get('/disableCompanies' ,isauth, blockcon.disableCompanies);


router.put('/cancleblock/:id',isorg , blockcon.cancleblock);





module.exports = router;


