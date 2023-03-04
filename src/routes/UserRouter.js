const { Router } = require('express')
const {
    loginUser,
    getUserCourses,
} = require('../controllers/UserController.js')
const {
    addPassedQuestion,
    getPassedQuestionsOfUser,
} = require('../controllers/QuestionController.js')
const checkAuth = require('../middlewares/auth.js')

const router = Router()

router.post('/login', loginUser)
router.get('/courses', checkAuth, getUserCourses)

router.post('/addPassedQuestion', checkAuth, addPassedQuestion)
router.get('/passedQuestions/:id', checkAuth, getPassedQuestionsOfUser)

module.exports = router
