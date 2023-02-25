const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.json({
                message: 'No access',
            })
        }
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded.isAdmin) {
            return res.json({
                message: 'No access',
            })
        }
        next()
    } catch (err) {
        res.status(401).json({
            message: 'Error',
            err,
        })
    }
}
