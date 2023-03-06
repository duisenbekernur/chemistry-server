const { UserModel, UserCourse } = require('../models/Models.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const ip = require('ip')

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

        const ipv4 = ip.address()

        const deviceArr = []
        // if (user.devices && !user.devices.includes(ipv4) && !user.isAdmin) {
        //     deviceArr.push(ipv4)
        //     for (let i = 0; i < user.devices.length; i++) {
        //         deviceArr.push(user.devices[i])
        //     }
        //     await UserModel.update(
        //         {
        //             devices: deviceArr,
        //         },
        //         { where: { name: name }, returning: true, plain: true }
        //     ).then(async (result) => {
        //         if (result[1].devices.length > 1) {
        //             await UserModel.destroy({
        //                 where: {
        //                     id: user.id,
        //                 },
        //             })
        //             return res.json({
        //                 message: 'Аккаунт удален',
        //             })
        //         }
        //     })
        // }

        console.log('USER', user)

        if (!user.devices) {
            deviceArr.push(req.body.ip)
            await UserModel.update(
                {
                    devices: deviceArr,
                },
                {
                    where: { name, password },
                    returning: true,
                    plain: true,
                }
            )
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
        res.json({ message: 'Ошибка сервера' })
    }
}

const getUserCourses = async (req, res) => {
    try {
        const id = req.user.id

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
        const userCourses = await user.getCourses()
        return res.json({
            userCourses,
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { loginUser, getUserCourses }
