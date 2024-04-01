const {check} = require('express-validator');
const valide = require('../../util/helper')

exports.login = [
    check('email').isEmail().withMessage('please enter email or password  correct').not().isEmpty().withMessage('حقل الايميل مطلوب'),
check('password').isLength({min : 5}).withMessage('enter password with 5 characters at least'),
valide.handleerror
]

