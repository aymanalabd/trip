const custumer = require('../controller/custumer');
const isauth = require('../middleware/isauth')
const express = require('express');
const router = express.Router();

router.post('/createcus' ,custumer.signup);
router.post('/logincus' ,custumer.logincus);
router.post('/verify/:token' ,custumer.verify);
router.post('/codereset' ,custumer.coderesetpassword);
router.post('/verifycode/:token' ,custumer.verifycode);
router.post('/resetpassword/:token' ,custumer.resetpassword);






module.exports = router;