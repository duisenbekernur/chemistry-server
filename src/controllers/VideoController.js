const { UserModel, CourseModel, VideoModel } = require('../models/Models.js')
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const utf = require('utf8')
const { Readable } = require('stream')
require('dotenv').config()

const storage = new Storage({
    keyFilename: path.join(
        __dirname,
        '../../just-sunrise-377710-7233ba47ace4.json'
    ),
    projectId: 'just-sunrise-377710',
})

const uploadVideo = async (req, res) => {
    try {
        console.log('HERE', req.file)
        if (!req.file) {
            return res.json({
                message: 'Видео не прикреплен!',
                code: 401,
            })
        }
        console.log('HERE 2')
        const isExist = await VideoModel.findOne({
            where: { name: req.file.originalname },
        })
        if (isExist) {
            return res.json({
                message: 'Видео уже существует',
                code: 401,
            })
        }

        const chemistryCourse = storage.bucket('chemistry-course')
        let { size, originalname } = req.file
        originalname = utf.decode(originalname)
        const file = chemistryCourse.file(originalname)
        const readableStream = new Readable({
            read(size) {
                this.push(req.file.buffer)
                this.push(null)
            },
        })

        const uploadStream = file.createWriteStream()
        readableStream.pipe(uploadStream)
        uploadStream.on('finish', async () => {
            const video = await VideoModel.create({
                link: 'no',
                name: originalname,
                size,
            })
        })
        uploadStream.on('error', (error) => {
            console.log('storage послал тебя нахуй', error)
        })
        res.json({
            message: 'Видео успешно загружено',
            code: 200,
        })
    } catch (error) {
        console.log(error)
    }
}

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

        console.log(videoModel)
        if (!videoModel) {
            return res.json({
                message: 'Video not found',
            })
        }
        await courseModel.addVideo(videoModel)
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

const getVideosOfCourse = async (req, res) => {
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

        const videos = await course.getVideos()

        res.json({
            message: 'Videos from course',
            videos,
        })
    } catch (error) {
        console.log(error)
    }
}

const getVideo = async (req, res) => {
    try {
        const { id } = req.params

        const video = await VideoModel.findOne({
            where: { id: id },
        })

        if (!video) {
            return res.json({ message: 'Video not found' })
        }

        return res.json({ video })
    } catch (error) {
        console.log(error)
    }
}

const deleteVideo = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.json({
                message: 'Укажите имя',
                code: 401,
            })
        }
        const video = await VideoModel.findOne({ where: { name } })
        if (!video) {
            return res.json({
                message: "Video doesn't exist",
                code: 402,
            })
        }
        const myBucket = storage.bucket('chemistry-course')
        const file = myBucket.file(name)
        await file.delete()
        await video.destroy()
        res.json({
            message: 'Video succesfully deleted',
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllVideos = async (req, res) => {
    try {
        const videos = await VideoModel.findAll()
        console.log(videos)
        if (!videos) {
            return res.json({ message: 'No videos yet' })
        }

        return res.json(videos)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addVideoToCourse,
    getVideosOfCourse,
    uploadVideo,
    deleteVideo,
    getVideo,
    getAllVideos,
}
