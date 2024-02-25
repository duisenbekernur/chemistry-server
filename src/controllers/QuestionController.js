const { QuestionModel, PassedQuestionsModel } = require('../models/MongoModels');
require('dotenv').config();

const createQuestion = async (req, res) => {
    try {
        const { question, answers, videoId, answerIds } = req.body;

        if (!question) {
            return res.json({ message: 'Enter a question' });
        }

        const isExists = await QuestionModel.findOne({ question, videoId });

        if (isExists) {
            return res.json({ message: 'Question already exists' });
        }

        const newQuestion = await QuestionModel.create({
            question,
            answers,
            videoId,
            answerIds,
        });

        return res.json({ message: 'Question added', question: newQuestion });
    } catch (error) {
        console.error('Error while adding a question', error);
        res.json({ message: 'Server error' });
    }
};

const getQuestionsOfVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const questions = await QuestionModel.find({ videoId: id });

        return res.json(questions);
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};

const deleteQuestionOfVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await QuestionModel.findByIdAndDelete(id);

        if (!question) {
            return res.json({ message: 'Question does not exist' });
        }

        return res.json({ message: 'Successfully deleted', question });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};

const addPassedQuestion = async (req, res) => {
    try {
        const params = req.body;

        const passedQuestion = await PassedQuestionsModel.create(params);

        res.json(passedQuestion);
    } catch (error) {
        console.error('Error while adding passed question', error);
        res.json({ message: 'Server error' });
    }
};

const getPassedQuestionsOfUser = async (req, res) => {
    try {
        const { id } = req.params;

        const questions = await PassedQuestionsModel.find({ userId: id });

        return res.json(questions);
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};

module.exports = {
    createQuestion,
    getQuestionsOfVideo,
    deleteQuestionOfVideo,
    addPassedQuestion,
    getPassedQuestionsOfUser,
};
