const { UserModel, UserCourseModel, CourseModel } = require('../models/MongoModels');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ip = require('ip');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find user by name
        const user = await UserModel.findOne({ name });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the hashed password with the provided password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match, return invalid credentials
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Add the device IP to the user's devices array if it's not already there
        const ipv4 = ip.address();
        const deviceArr = user.devices || [];

        if (!deviceArr.includes(req.body.ip)) {
            deviceArr.push(req.body.ip);

            // Update the user's devices array in the database
            await UserModel.findOneAndUpdate(
                { name },
                { devices: deviceArr },
                { new: true }
            );
        }

        // Create a JWT token for the user
        const token = jwt.sign(
            {
                id: user._id, // MongoDB uses "_id" as the primary key
                isAdmin: user.isAdmin,
                name: user.name,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1000h' }
        );

        return res.json({
            token,
        });
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getUserCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                message: 'User not found',
                code: 401,
            });
        }

        const userCourses = await UserCourseModel.find({ userId });

        // Extract courseId values from userCourses
        const courseIds = userCourses.map(userCourse => userCourse.courseId);

        // Query CourseModel to get the corresponding courses
        const courses = await CourseModel.find({ _id: { $in: courseIds } });

        return res.json({
            userCourses: courses,
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
};


module.exports = { loginUser, getUserCourses };
