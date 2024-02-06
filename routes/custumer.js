const custumer = require('../controller/custumer');
const isauth = require('../middleware/isauth')
const express = require('express');
const {check} = require('express-validator')
const router = express.Router();

router.post('/createcus' ,
check('email').isEmail().withMessage('الرجاء ادخال ايميل صحيح').not().isEmpty().withMessage('حقل الايميل مطلوب')
,check('password').isLength({min : 5}).withMessage('ادخل كلمة مرور مؤلفة من 5 محارف على الافل')
,custumer.signup);
router.post('/logincus' ,check('email').isEmail().withMessage('الرجاء ادخال ايميل صحيح').not().isEmpty().withMessage('حقل الايميل مطلوب'),
check('password').isLength({min : 5}).withMessage('Eادخل كلمة مرور مؤلفة من 5 محارف على الافل')
,custumer.logincus);
router.post('/verifycodepassword' ,custumer.verifycodepassword);
router.post('/verifycodecustumer',check('ver').isNumeric().withMessage('الكود يجب ان يكون رقم') ,custumer.verifycodecustumer);
router.post('/coderesetpassword' ,check('email').isEmail().withMessage('الرجاء ادخال ايميل صحيح').not().isEmpty().withMessage('حقل الايميل مطلوب'),custumer.coderesetpassword);
router.post('/resetpassword' ,check('password').isLength({min : 5}).withMessage('ادخل كلمة مرور مؤلفة من 5 محارف على الافل'),custumer.resetpassword);






module.exports = router;