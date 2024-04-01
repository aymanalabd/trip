const {check} = require('express-validator');
const valide = require('../../util/helper')

exports.resetpassword = [
check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least'),
valide.handleerror
]

