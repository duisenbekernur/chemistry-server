const { Router } = require('express')
const {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    addUserToCourse,
    deleteUserFromCourse,
} = require('../controllers/AdminController.js')
const {
    getVideosFromCourse,
    addVideoToCourse,
} = require('../controllers/VideoController.js')
const checkAuth = require('../middlewares/auth.js')
const isAdmin = require('../middlewares/isAdmin.js')

const router = Router()

router.get('/users', checkAuth, isAdmin, getUsers)
router.get('/users/:id', checkAuth, isAdmin, getUserById)
router.post('/users', checkAuth, isAdmin, createUser)
router.post('/addUserToCourse', checkAuth, isAdmin, addUserToCourse)
router.delete('/deleteUserFromCourse', checkAuth, isAdmin, deleteUserFromCourse)
router.delete('/users/:id', checkAuth, isAdmin, deleteUser)

router.post('/addVideoToCourse', isAdmin, checkAuth, addVideoToCourse)
router.get('/getVideosFromCourse', isAdmin, checkAuth, getVideosFromCourse)

module.exports = router
