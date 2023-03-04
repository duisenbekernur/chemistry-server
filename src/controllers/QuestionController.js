const { QuestionModel, PassedQuestions } = require('../models/Models.js')
require('dotenv').config()

const createQuestion = async (req, res) => {
    try {
        const { question, answers, videoId, answerIds } = req.body

        if (!question) {
            return res.json({ message: 'Введите вопрос' })
        }

        const isExists = await QuestionModel.findOne({
            where: { question, videoId },
        })
        if (isExists)
            return res.json({ message: 'Такой вопрос уже существует' })

        const test = await QuestionModel.create({
            question,
            answers,
            videoId,
            answerIds,
        })

        return res.json({ message: 'Вопрос добавлен', test })
    } catch (error) {
        console.log('Ошибка при добавлении вопроса', error)
    }
}

const getQuestionsOfVideo = async (req, res) => {
    try {
        const { id } = req.params

        const questions = await QuestionModel.findAll({
            where: { videoId: id },
        })

        return res.json(questions)
    } catch (error) {}
}

const deleteQuestionOfVideo = async (req, res) => {
    try {
        const { id } = req.params

        const question = await QuestionModel.findOne({
            where: { id },
        })

        if (!question) {
            return res.json({ message: 'Такой вопрос не существует' })
        }

        await question.destroy()

        return res.json({ message: 'Успешно удалено', question })
    } catch (error) {
        console.log(error)
    }
}

const addPassedQuestion = async (req, res) => {
    try {
        const params = req.body

        const passedQuestion = await PassedQuestions.create(params)

        res.json(passedQuestion)
    } catch (error) {
        console.log('eror', error)
    }
}

const getPassedQuestionsOfUser = async (req, res) => {
    try {
        const { id } = req.params

        const questions = await PassedQuestions.findAll({
            where: { userId: id },
        })

        return res.json(questions)
    } catch (error) {}
}

module.exports = {
    createQuestion,
    getQuestionsOfVideo,
    deleteQuestionOfVideo,
    addPassedQuestion,
    getPassedQuestionsOfUser,
}
