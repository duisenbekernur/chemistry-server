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
    addAccessToStorage,
} = require('../controllers/VideoController.js')

const {
    createQuestion,
    getQuestionsOfVideo,
    deleteQuestionOfVideo,
} = require('../controllers/QuestionController.js')

const { authorizeGoogle } = require('../controllers/VideoHostController.js')

const checkAuth = require('../middlewares/auth.js')
const isAdmin = require('../middlewares/isAdmin.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/users', checkAuth, isAdmin, getUsers)
router.get('/users/:id', checkAuth, getUserById)
router.post('/users', checkAuth, isAdmin, createUser)
router.post('/addUserToCloud', checkAuth, isAdmin, addAccessToStorage)
router.post('/addUserToCourse', checkAuth, isAdmin, addUserToCourse)
router.post('/deleteUserFromCourse', checkAuth, isAdmin, deleteUserFromCourse)
router.delete('/users/:id', checkAuth, isAdmin, deleteUser)

router.get('/getUsersByCourse/:id', checkAuth, isAdmin, getUsersByCourse)

router.post(
    '/uploadVideo',
    checkAuth,
    isAdmin,
    upload.single('video'),
    uploadVideo
)
router.get('/videos', checkAuth, isAdmin, getAllVideos)
router.get('/getVideo/:id', checkAuth, getVideoContent)
router.delete('/deleteVideo/:id', checkAuth, isAdmin, deleteVideo)

router.post('/addVideoToCourse', checkAuth, isAdmin, addVideoToCourse)
router.get('/getVideosOfCourse/:id', checkAuth, getVideosOfCourse)

router.get('/questions/:id', checkAuth, getQuestionsOfVideo)
router.delete('/deleteQuestion/:id', checkAuth, isAdmin, deleteQuestionOfVideo)
router.post('/createQuestion', checkAuth, isAdmin, createQuestion)

// host video
router.get('/authorizeGoogle', authorizeGoogle)

module.exports = router
