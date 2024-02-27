const { Router } = require('express')
const {
    getAllCourses,
    createCourse,
    deleteCourse,
} = require('../controllers/CourseController.js')
const checkAuth = require('../middlewares/auth.js')
const isAdmin = require('../middlewares/isAdmin.js')

const router = Router()

router.get('/', getAllCourses)
router.post('/create', checkAuth, isAdmin, createCourse)
router.delete('/delete/:id', checkAuth, isAdmin, deleteCourse)

module.exports = router
