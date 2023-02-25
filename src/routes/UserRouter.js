const { Router } = require('express')
const {
    loginUser,
    getUserCourses,
} = require('../controllers/UserController.js')
const checkAuth = require('../middlewares/auth.js')

const router = Router()

router.post('/login', loginUser)
router.get('/courses', checkAuth, getUserCourses)

module.exports = router
