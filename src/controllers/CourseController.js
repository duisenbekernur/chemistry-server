const { CourseModel, UserModel, UserCourseModel} = require('../models/MongoModels');
require('dotenv').config();

const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.find();

        if (!courses.length) {
            res.json({ message: 'No courses available' });
        }

        res.json({ courses });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};

const createCourse = async (req, res) => {
    try {
        const params = req.body;

        const isExists = await CourseModel.findOne({ name: req.body.name });

        if (isExists) {
            return res.json({ message: 'Course already exists' });
        }

        const course = await CourseModel.create({...params, createdAt: new Date()});
        res.json({
            message: 'Course successfully created!',
            course,
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await CourseModel.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.json({ message: 'Course does not exist' });
        }

        res.json({ message: 'Course successfully deleted' });
    } catch (error) {
        console.error('Error deleting course', error);
        res.json({ message: 'Server error' });
    }
};
const getUsersByCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id);

        if (!course) {
            return res.json({ message: 'Course not found' });
        }

        // Find user-course relationships for the given course
        const userCourseRelationships = await UserCourseModel.find({ courseId: course._id });

        // Extract user IDs from the relationships
        const userIds = userCourseRelationships.map(relationship => relationship.userId);

        // Find users based on the extracted user IDs
        const users = await UserModel.find({ _id: { $in: userIds } });

        return res.json(users);
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};


module.exports = { getAllCourses, createCourse, deleteCourse, getUsersByCourse };
