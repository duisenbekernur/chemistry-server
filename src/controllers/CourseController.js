const { CourseModel } = require('../models/Models.js')

const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.findAll()

        console.log(courses)
        if (!courses) {
            res.json({ message: 'Курсов пока нету' })
        }

        res.json(courses)
    } catch (error) {
        console.log(error)
    }
}

const createCourse = async (req, res) => {
    try {
        const params = req.body
        const isExists = await CourseModel.findOne({
            where: { name: req.body.name },
        })

        if (isExists) {
            return res.json({ message: 'Такой курс уже существует' })
        }

        const course = await CourseModel.create(params)
        res.json({
            message: 'Курс успешно создан!',
            course,
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteCourse = async (req, res) => {
    try {
        const isExist = await CourseModel.findOne({
            where: { id: req.params.id },
        })

        if (!isExist) {
            return res.json({ message: 'Такой курс не существует' })
        }

        await CourseModel.destroy({ where: { id: req.params.id } })

        res.json('Курс успешно удалено')
    } catch (error) {
        console.log('Ошибка удалении курса', error)
    }
}

module.exports = { getAllCourses, createCourse, deleteCourse }
