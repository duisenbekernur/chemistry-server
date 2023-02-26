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
    getVideo,
    getAllVideos,
} = require('../controllers/VideoController.js')
const checkAuth = require('../middlewares/auth.js')
const isAdmin = require('../middlewares/isAdmin.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/users', checkAuth, isAdmin, getUsers)
router.get('/users/:id', checkAuth, getUserById)
router.post('/users', checkAuth, isAdmin, createUser)
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
router.get('/getVideo/:id', checkAuth, getVideo)
router.delete('/deleteVideo', checkAuth, isAdmin, deleteVideo)

router.post('/addVideoToCourse', checkAuth, isAdmin, addVideoToCourse)
router.get('/getVideosOfCourse/:id', checkAuth, isAdmin, getVideosOfCourse)

module.exports = router
