const pool = require('../utils/db.js')
const { UserModel, CourseModel } = require('../models/Models.js')

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll()
        if (!users) {
            return res.json({
                message: 'В базе данных не пользвателей',
            })
        }
        res.send(users)
    } catch (error) {
        res.json({
            message: 'Ошибка',
            error,
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const user = await UserModel.findOne({ where: { id: req.params.id } })

        if (!user) {
            return res.json({ message: 'Пользователь не существует' })
        }

        res.json(user)
    } catch (error) {
        res.json('Ошибка', error)
    }
}

const createUser = async (req, res) => {
    try {
        const params = req.body
        const isExist = await UserModel.findOne({
            where: { name: req.body.name },
        })
        if (isExist) {
            return res.json({
                message: 'Пользватель уже существует',
            })
        }
        const user = await UserModel.create(params)
        res.json({
            message: 'Пользватель успешно создан!',
            user,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Ошибка при созданий пользвателя',
            error,
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const isExist = await UserModel.findOne({
            where: { id: req.params.id },
        })
        if (!isExist) {
            return res.json({
                message: 'Пользватель с таким айди не существует',
            })
        }

        await UserModel.destroy({
            where: {
                id: req.params.id,
            },
        })

        res.json('Успешно удалено!')
    } catch (error) {
        res.json({
            message: 'Ошибка при удалении',
            error,
        })
    }
}

const addUserToCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        if (!userId || !courseId) {
            return res.json({
                message: 'User or course is not provided',
                code: 401,
            })
        }
        const course = await CourseModel.findOne({
            where: {
                id: courseId,
            },
        })
        if (!course) {
            return res.json({
                message: 'Course is not found',
            })
        }
        const user = await UserModel.findOne({
            where: {
                id: userId,
            },
        })
        if (!user) {
            return res.json({
                message: 'User is not found',
            })
        }
        await course.addUser(user)
        return res.json({
            message: 'Succesfully added',
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteUserFromCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        if (!userId || !courseId) {
            return res.json({
                message: 'User or course is not provided',
                code: 401,
            })
        }
        const course = await CourseModel.findOne({
            where: {
                id: courseId,
            },
        })
        if (!course) {
            return res.json({
                message: 'Course is not found',
            })
        }
        const user = await UserModel.findOne({
            where: {
                id: userId,
            },
        })
        if (!user) {
            return res.json({
                message: 'User is not found',
            })
        }
        await course.removeUser(user)
        return res.json({
            message: 'Succesfully remooved',
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    addUserToCourse,
    deleteUserFromCourse,
}
