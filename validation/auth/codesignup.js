
const {check} = require('express-validator');
const valide = require('../../util/helper')

exports.codesignup = [
    check('code').isNumeric().withMessage('the code must be number')
        .isLength({min:5}).withMessage('the code must be at least 5 characters'),
   
valide.handleerror
]


