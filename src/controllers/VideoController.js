const { UserModel, CourseModel } = require('../models/Models.js')
require('dotenv').config()

const addVideoToCourse = async (req, res) => {
    try {
        const { courseId, videoId } = req.body
        if (!courseId || !videoId) {
            return res.json({
                message: 'Неверно указан курс или видео',
            })
        }
        const courseModel = await CourseModel.findOne({
            where: {
                id: courseId,
            },
        })
        if (!courseModel) {
            return res.json({
                message: 'Курс не найден',
            })
        }

        const videoModel = await VideoModel.findOne({
            where: {
                id: videoId,
            },
        })

        if (!videoModel) {
            return res.json({
                message: 'Video not found',
            })
        }

        await courseModel.addVideoModel(videoModel)
        return res.json({
            message: 'Succesfully added',
            code: 201,
        })
    } catch (error) {
        res.json({
            message: 'Error occured with adding video to this course',
            error,
        })
    }
}

const getVideosFromCourse = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                message: 'Укажите курс',
            })
        }

        const course = await CourseModel.findOne({
            where: {
                id,
            },
        })
        if (!course) {
            return res.json({
                message: 'Курс не найден',
            })
        }

        const videos = await course.getVideoModels()

        res.json({
            message: 'Videos from course',
            videos,
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { addVideoToCourse, getVideosFromCourse }
