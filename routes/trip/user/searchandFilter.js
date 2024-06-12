
const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const searchandFilter = require('../../../controller/trip/user/search_and_filter') ;
const express = require('express');
const router = express.Router();

//البحث عن رحلات
router.post('/search' , searchandFilter.search);

//فلترة الرحلات عن طريق الشركة
router.post('/searchbycompany' , searchandFilter.filterbycompany);

//فلترة الرحلات عن طريق نوع الباص
router.post('/searchbytypebus' , searchandFilter.filterbytypebus);



//جلب المدن من اجل البحث عن رحلات
router.get('/getcities' , searchandFilter.getcities);


//جلب نوع الباص
router.get('/gettypebus' , searchandFilter.gettypebus);

//جلب الشركات من اجل الفلترة
router.get('/getcompanies' , searchandFilter.getcompanies);

module.exports = router;
