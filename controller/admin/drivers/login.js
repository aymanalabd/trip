const bcrypt = require('bcryptjs');
const {generateToken} = require('../../../util/helper')

//models
const driver = require('../../../models/driver');

exports.logindriver = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    driver.findOne({ where: { email: email } }).then(result => {
       
        if (!result) {
            return res.error("error in email or password", 404)
        }        bcrypt.compare(password, result.password).then(ok => {
            if (!ok) {
                return res.error("error in email or password", 404)
            }
            const {token , refreshtoken} = generateToken({id:result.id })

            return res.success({ result: result, token: token , refreshtoken:refreshtoken }, "successfull")
        }).catch(err => {
           return res.error(err.message, 500)
        })

    }).catch(err => {
       return res.error(err, 500)
    })

}
