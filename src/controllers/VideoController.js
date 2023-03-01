const { UserModel, CourseModel, VideoModel } = require('../models/Models.js')
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs')
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

        // // signed link of video
        // const options = {
        //     version: 'v4',
        //     action: 'read',
        //     expires: Date.now() + 100000, // 10 sec from now
        // }
        // const signedUrl = null
        // chemistryCourse.file(originalname).getSignedUrl(options, (err, url) => {
        //     if (err) {
        //         console.log(err)
        //         return
        //     }
        //     console.log(`signed url = ${url}`)
        // })

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
        const name = video.name
        const myBucket = storage.bucket('chemistry-course')
        const file = myBucket.file(name)
        await file.delete()
        await video.destroy()
        res.json({
            message: 'Видео успешно удалено',
        })
    } catch (error) {
        console.log(error)
    }
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

const addAccessToStorage = async (req, res) => {
    try {
        const chemistryCourse = storage.bucket('chemistry-course')

        console.log(chemistryCourse.iam.getPolicy)
        return

        chemistryCourse.iam.getPolicy((err, policy) => {
            if (err) {
                console.error(`Error getting bucket IAM policy: ${err}`)
                return
            }

            // Create a new binding for the new user's email address
            const role = 'roles/storage.objectViewer' // Viewer access
            const members = [`user:${req.body.name}`]
            const newBinding = { role, members }

            // Add the new binding to the existing IAM policy
            policy.bindings.push(newBinding)

            // Update the bucket IAM policy with the new binding
            storage
                .bucket(bucketName)
                .iam.setPolicy(policy, (err, updatedPolicy) => {
                    if (err) {
                        console.error(`Error setting bucket IAM policy: ${err}`)
                        return
                    }

                    console.log(
                        `Added user ${req.body.name} to bucket ${bucketName} with viewer access.`
                    )
                })
        })
    } catch (error) {
        console.log('logged error', error)
    }
}

module.exports = {
    addVideoToCourse,
    getVideosOfCourse,
    uploadVideo,
    deleteVideo,
    getVideoContent,
    getAllVideos,
    addAccessToStorage,
}
