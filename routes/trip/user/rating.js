
const isauth = require('../../../middleware/isauth');
const reviewcontroller = require('../../../controller/trip/user/rating') ;

const express = require('express');
const router = express.Router();


router.post('/rating/:id',isauth , reviewcontroller.rating);





module.exports = router;
