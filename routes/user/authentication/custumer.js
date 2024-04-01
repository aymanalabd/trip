const custumer = require('../../../controller/user/authentication/custumer');
const isauth = require('../../../middleware/isauth')


//validation
const validatelogin = require('../../../validation/auth/login')
const validateregister = require('../../../validation/auth/register')
const validateresetpassword = require('../../../validation/auth/resetpassword')
const validatecoderesetpassword = require('../../../validation/auth/coderesetpassword')
const validatecodesignup = require('../../../validation/auth/codesignup')




const express = require('express');
const router = express.Router();





//post custumer
router.post('/refreshtoken' ,custumer.refreshtoken);
router.post('/createcus' ,validateregister.register ,custumer.signup);
router.post('/logincus' ,validatelogin.login,custumer.logincus);
router.post('/verifycodepassword/:id' ,custumer.verifycodepassword);
router.post('/verifycodecustumer/:id' ,validatecodesignup.codesignup,custumer.verifycodecustumer);
router.post('/coderesetpassword' ,validatecoderesetpassword.coderesetpassword,custumer.coderesetpassword);
router.post('/resetpassword/:id',validateresetpassword.resetpassword ,custumer.resetpassword);






module.exports = router;