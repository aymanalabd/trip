const isauth = require('../../../middleware/isauth');
const isorg = require('../../../middleware/isorg');
const express = require('express');
const router = express.Router();

const getcustumerscon = require('../../../controller/admin/customers/getcustumers') ;


router.get('/getcustumers/:id' , getcustumerscon.getcustumers);

router.post('/getcustumersbynumberdisk/:id' , getcustumerscon.getcustumersbynumberdisk);

router.get('/getcustumersipaid/:id', getcustumerscon.getcustumersispaid);


router.get('/getcustumersisnotpaid',isorg , getcustumerscon.getcustumersisnotpaid);





module.exports = router;


