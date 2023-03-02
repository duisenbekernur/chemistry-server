const { UserModel, CourseModel, VideoModel } = require('../models/Models.js')
const path = require('path')
const fs = require('fs')
const ytdl = require('ytdl-core')
const utf = require('utf8')
require('dotenv').config()

function isYouTubeLink(link) {
    var youtubeRegex = /^(https?\:\/\/)/
    return youtubeRegex.test(link)
}

const uploadVideo = async (req, res) => {
    try {
        const { link } = req.body

        console.log(link)

        if (!isYouTubeLink(link)) {
            return res.json({
                message: 'Неправильный адресс видео',
                code: 401,
            })
        }

        const isExist = await VideoModel.findOne({
            where: { link },
        })
        if (isExist) {
            return res.json({
                message: 'Видео уже существует',
                code: 401,
            })
        }

        const metInfo = await ytdl.getInfo(link)
        const name = metInfo.player_response.videoDetails.title

        console.log('metinfo', name)

        const video = await VideoModel.create({
            link,
            name,
        })

        res.json({
            message: 'Видео успешно загружено',
            code: 200,
        })
    } catch (error) {
        console.log('error', error)
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
        const isExists = await VideoModel.findOne({
            where: { id: videoId, courseId },
        })
        if (isExists) {
            return res.json({ message: 'Видео уже существует в этом курсе' })
        }

        const videoModel = await VideoModel.findOne({
            where: {
                id: videoId,
            },
        })

        if (!videoModel) {
            return res.json({
                message: 'Видео не найдено',
            })
        }
        await courseModel.addVideo(videoModel)
        return res.json({
            message: 'Успешно добавлено',
            code: 201,
            video: videoModel,
        })
    } catch (error) {
        res.json({
            message: 'Error occured with adding video to this course' + error,
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

const getVideoContent = async (req, res) => {
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
        const { id } = req.params

        const video = await VideoModel.findOne({ where: { id } })
        if (!video) {
            return res.json({
                message: 'Такое видео не существует',
                code: 402,
            })
        }

        await video.destroy()
        res.json({
            message: 'Видео успешно удалено',
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteVideoFromCourse = async (req, res) => {
    try {
        const { id } = req.params

        VideoModel.update(
            {
                courseId: null,
            },
            {
                where: {
                    id,
                },
            }
        )

        res.json({ message: 'Видео успешно удалено с курса!' })
    } catch (error) {}
}

const getAllVideos = async (req, res) => {
    try {
        const videos = await VideoModel.findAll()
        if (!videos) {
            return res.json({ message: 'No videos yet' })
        }

        return res.json({ videos })
    } catch (error) {
        console.log(error)
    }
}

const getVideo = async (req, res) => {
    try {
        const { id } = req.params
        const range = req.headers.range
        if (!range) {
            return res.status(400).json({ message: 'Requires Range header' })
        }

        const video = await VideoModel.findOne({ where: { name } })

        const CHUNK_SIZE = 10 ** 6
        const start = Number(range.replace(/\D/g, ''))
        const end = Math.min(start + CHUNK_SIZE, video.size - 1)

        const contentLength = end - start + 1
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${video.size}`,
            'Accept-Ranges': 'bytes',
            'Content-length': contentLength,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, headers)

        const videoStream = fs.createReadStream(video.name, { start, end })

        videoStream.pipe(res)
    } catch (error) {}
}

module.exports = {
    addVideoToCourse,
    getVideosOfCourse,
    uploadVideo,
    deleteVideo,
    getVideoContent,
    getAllVideos,
    deleteVideoFromCourse,
}
