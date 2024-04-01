exports.response = (req, res, next) => {

    res.success = (data, message=null) => {

        return res.status(200).json({ message, data, success: true })
    }


    res.error = (message,code, data = null) => {

        return res.status(code).json({ message, data, success: false })
    }


    next();


}