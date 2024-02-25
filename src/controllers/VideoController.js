const { UserModel, CourseModel, VideoModel } = require('../models/MongoModels');
const path = require('path');
const fs = require('fs').promises;
const ytdl = require('ytdl-core');
const utf = require('utf8');
require('dotenv').config();

function isYouTubeLink(link) {
    var youtubeRegex = /^(https?\:\/\/)/;
    return youtubeRegex.test(link);
}

const uploadVideo = async (req, res) => {
    try {
        const { link } = req.body;

        console.log(link);

        if (!isYouTubeLink(link)) {
            return res.json({
                message: 'Invalid video link',
                code: 401,
            });
        }

        const isExist = await VideoModel.findOne({ link });

        if (isExist) {
            return res.json({
                message: 'Video already exists',
                code: 401,
            });
        }

        const metInfo = await ytdl.getInfo(link);
        const name = metInfo.player_response.videoDetails.title;

        console.log('metinfo', name);

        const video = await VideoModel.create({
            link,
            name,
        });

        res.json({
            message: 'Video successfully uploaded',
            code: 200,
        });
    } catch (error) {
        console.error('Error during video upload', error);
        res.json({
            message: 'Server error',
        });
    }
};

const addVideoToCourse = async (req, res) => {
    try {
        const { courseId, videoId } = req.body;

        if (!courseId || !videoId) {
            return res.json({
                message: 'Incorrect course or video specified',
            });
        }

        const courseModel = await CourseModel.findById(courseId);

        if (!courseModel) {
            return res.json({
                message: 'Course not found',
            });
        }

        const isExists = await VideoModel.findOne({
            _id: videoId,
            courseId: courseModel._id,  // use the courseModel's ObjectId
        });

        if (isExists) {
            return res.json({
                message: 'Video already exists in this course',
            });
        }

        // Update the VideoModel with the courseId
        await VideoModel.findByIdAndUpdate(videoId, { courseId: courseModel._id });

        return res.json({
            message: 'Successfully added',
            code: 201,
            video: { _id: videoId, courseId: courseModel._id },
        });
    } catch (error) {
        console.error('Error occurred while adding video to this course', error);
        res.json({
            message: 'Error occurred with adding video to this course',
            error,
        });
    }
};

const getVideosOfCourse = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.json({
                message: 'Specify the course',
            });
        }

        const videos = await VideoModel.find({
            courseId: id,
        });

        res.json({
            message: 'Videos from course',
            videos,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Server error',
        });
    }
};


const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await VideoModel.findById(id);

        if (!video) {
            return res.json({
                message: 'Video not found',
                code: 402,
            });
        }

        await video.remove();

        res.json({
            message: 'Video successfully deleted',
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Server error',
        });
    }
};

const deleteVideoFromCourse = async (req, res) => {
    try {
        const { id } = req.params;

        await VideoModel.findByIdAndUpdate(id, {
            courseId: null,
        });

        res.json({
            message: 'Video successfully removed from the course',
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Server error',
        });
    }
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await VideoModel.find();

        console.log(videos)

        if (!videos) {
            return res.json({
                message: 'No videos yet',
            });
        }

        return res.json({
            videos,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Server error',
        });
    }
};

const getVideoContent = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await VideoModel.findById(id);

        if (!video) {
            return res.json({
                message: 'Video not found',
            });
        }

        return res.json({
            video,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Server error',
        });
    }
};

module.exports = {
    addVideoToCourse,
    getVideosOfCourse,
    uploadVideo,
    deleteVideo,
    deleteVideoFromCourse,
    getAllVideos,
    getVideoContent,
};
