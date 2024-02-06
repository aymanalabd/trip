const custumer = require('../controller/custumer');
const isauth = require('../middleware/isauth')
const express = require('express');
const {check} = require('express-validator')
const router = express.Router();

router.post('/createcus' ,
check('email').isEmail().withMessage('please enter email correct').not().isEmpty().withMessage('field email is required')
,check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least')
,custumer.signup);
router.post('/logincus' ,check('email').isEmail().withMessage('please enter email correct').not().isEmpty().withMessage('حقل الايميل مطلوب'),
check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least')
,custumer.logincus);
router.post('/verifycodepassword' ,custumer.verifycodepassword);
router.post('/verifycodecustumer',check('ver').isNumeric().withMessage('code must be number') ,custumer.verifycodecustumer);
router.post('/coderesetpassword' ,check('email').isEmail().withMessage('please enter email correct').not().isEmpty().withMessage('حقل الايميل مطلوب'),custumer.coderesetpassword);
router.post('/resetpassword' ,check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least'),custumer.resetpassword);






module.exports = router;