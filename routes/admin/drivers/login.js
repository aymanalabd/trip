const driver = require('../../../controller/admin/drivers/login');
const express = require('express');
const router = express.Router();

router.post('/logindriver' ,driver.logindriver);




module.exports = router;