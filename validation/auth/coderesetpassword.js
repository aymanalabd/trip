
const {check} = require('express-validator');
const valide = require('../../util/helper')

exports.coderesetpassword = [
    check('email').isEmail().withMessage('please enter email correct')
    .not().isEmpty().withMessage('email is required'),
valide.handleerror
]


