const {check} = require('express-validator');
const valide = require('../../util/helper')

exports.register = [
    
    check('email').isEmail().withMessage('please enter email correct').not().isEmpty().withMessage('field email is required')
    ,check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least'),
valide.handleerror
]

