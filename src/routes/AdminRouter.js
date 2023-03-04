const { Router } = require('express')
const {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    addUserToCourse,
    deleteUserFromCourse,
} = require('../controllers/AdminController.js')

const { getUsersByCourse } = require('../controllers/CourseController.js')

const {
    getVideosOfCourse,
    addVideoToCourse,
    uploadVideo,
    deleteVideo,
    getVideoContent,
    getAllVideos,
    deleteVideoFromCourse,
} = require('../controllers/VideoController.js')

const {
    createQuestion,
    getQuestionsOfVideo,
    deleteQuestionOfVideo,
} = require('../controllers/QuestionController.js')

const checkAuth = require('../middlewares/auth.js')
const isAdmin = require('../middlewares/isAdmin.js')

const router = Router()

router.get('/users', checkAuth, isAdmin, getUsers)
router.get('/users/:id', checkAuth, getUserById)
router.post('/users', checkAuth, isAdmin, createUser)
router.post('/addUserToCourse', checkAuth, isAdmin, addUserToCourse)
router.post('/deleteUserFromCourse', checkAuth, isAdmin, deleteUserFromCourse)
router.delete('/users/:id', checkAuth, isAdmin, deleteUser)

router.get('/getUsersByCourse/:id', checkAuth, isAdmin, getUsersByCourse)

router.post('/uploadVideo', checkAuth, isAdmin, uploadVideo)
router.get('/videos', checkAuth, getAllVideos)
router.get('/getVideo/:id', checkAuth, getVideoContent)
router.delete('/deleteVideo/:id', checkAuth, isAdmin, deleteVideo)

router.post('/addVideoToCourse', checkAuth, isAdmin, addVideoToCourse)
router.get('/getVideosOfCourse/:id', checkAuth, getVideosOfCourse)
router.delete(
    '/deleteVideoFromCourse/:id',
    checkAuth,
    isAdmin,
    deleteVideoFromCourse
)

router.get('/questions/:id', checkAuth, getQuestionsOfVideo)
router.delete('/deleteQuestion/:id', checkAuth, isAdmin, deleteQuestionOfVideo)
router.post('/createQuestion', checkAuth, isAdmin, createQuestion)

module.exports = router
