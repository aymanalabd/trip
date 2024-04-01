const companies = require('../../../controller/admin/authentication/companies');
// const isauth = require('../middleware/isauth');
// const isadmin = require('../middleware/isadmin')
const express = require('express');
const router = express.Router();
// router.get('/getorg' , organization.getorg);
// router.post('/createorg' ,isauth,isadmin, organization.createorg);
router.post('/login' , companies.login);


module.exports = router;