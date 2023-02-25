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
                message: 'Пользователь не авторизован',
                headers: req.headers,
            })
        }
        const token = authHeader.split(' ')[1]
        console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json(err)
    }
}
