const { UserModel } = require('../models/Models.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body

        const user = await UserModel.findOne({
            where: {
                name: name,
                password: password,
            },
        })

        if (!user) {
            return res.json('Ошибка данных')
        }

        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
                name: user.name,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1000h' }
        )

        return res.json({
            token,
        })
    } catch (error) {
        console.log('Ошибка при логин', error)
    }
}

const getUserCourses = async (req, res) => {
    try {
        const id = req.user.id
        console.log(req.user)
        
        const user = await UserModel.findOne({
            where: {
                id,
            },
        })
        if (!user) {
            return res.json({
                message: 'User not found',
                code: 401,
            })
        }
        const userCourses = await user.getCourseModels()
        return res.json({
            userCourses,
            req
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { loginUser, getUserCourses }
