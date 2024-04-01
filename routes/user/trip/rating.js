
const isauth = require('../../../middleware/isauth');
const reviewcontroller = require('../../../controller/user/trip/rating') ;

const express = require('express');
const router = express.Router();


router.post('/rating/:id',isauth , reviewcontroller.rating);

router.get('/getblock' ,isauth, reviewcontroller.getblock)



module.exports = router;
