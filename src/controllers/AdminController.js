// const pool = require('../utils/db.js')
// const { UserModel, CourseModel, UserCourse } = require('../models/Models.js')
//
// const storage = require('./VideoController.js')
//
// const getUsers = async (req, res) => {
//     try {
//         const users = await UserModel.findAll()
//         if (!users) {
//             return res.json({
//                 message: 'В базе данных не пользвателей',
//             })
//         }
//         res.json({users})
//     } catch (error) {
//         res.json({
//             message: 'Ошибка',
//             error,
//         })
//     }
// }
//
// const getUserById = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id)
//         const user = await UserModel.findOne({ where: { id: req.params.id } })
//
//         if (!user) {
//             return res.json({ message: 'Пользователь не существует' })
//         }
//
//         res.json(user)
//     } catch (error) {
//         res.json('Ошибка', error)
//     }
// }
//
// const createUser = async (req, res) => {
//     try {
//         const params = req.body
//         const isExist = await UserModel.findOne({
//             where: { name: req.body.name },
//         })
//         if (isExist) {
//             return res.json({
//                 message: 'Пользватель уже существует',
//             })
//         }
//         const user = await UserModel.create(params)
//         res.json({
//             message: 'Пользватель успешно создан!',
//             user,
//         })
//     } catch (error) {
//         console.log(error)
//         res.json({
//             message: 'Ошибка при созданий пользвателя',
//             error,
//         })
//     }
// }
//
// const deleteUser = async (req, res) => {
//     try {
//         const isExist = await UserModel.findOne({
//             where: { id: req.params.id },
//         })
//         if (!isExist) {
//             return res.json({
//                 message: 'Пользватель с таким айди не существует',
//             })
//         }
//
//         await UserModel.destroy({
//             where: {
//                 id: req.params.id,
//             },
//         })
//
//         res.json({ message: 'Успешно удалено!' })
//     } catch (error) {
//         res.json({
//             message: 'Ошибка при удалении',
//             error,
//         })
//     }
// }
//
// const addUserToCourse = async (req, res) => {
//     try {
//         const { userId, courseId } = req.body
//         if (!userId || !courseId) {
//             return res.json({
//                 message: 'User or course is not provided',
//                 code: 401,
//             })
//         }
//         const course = await CourseModel.findOne({
//             where: {
//                 id: courseId,
//             },
//         })
//         if (!course) {
//             return res.json({
//                 message: 'Курс не найден',
//             })
//         }
//         const user = await UserModel.findOne({
//             where: {
//                 id: userId,
//             },
//         })
//         if (!user) {
//             return res.json({
//                 message: 'Пользователь не найден',
//             })
//         }
//         const isUserExists = await UserCourse.findOne({
//             where: { userId, courseId },
//         })
//         if (isUserExists) {
//             return res.json({ message: 'Пользовател уже существует' })
//         }
//         await course.addUser(user)
//         return res.json({
//             message: 'Успешно добавлено',
//             user
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
//
// const deleteUserFromCourse = async (req, res) => {
//     try {
//         const { userId, courseId } = req.body
//         if (!userId || !courseId) {
//             return res.json({
//                 message: 'User or course is not provided',
//                 code: 401,
//             })
//         }
//         const course = await CourseModel.findOne({
//             where: {
//                 id: courseId,
//             },
//         })
//         if (!course) {
//             return res.json({
//                 message: 'Course is not found',
//             })
//         }
//         const user = await UserModel.findOne({
//             where: {
//                 id: userId,
//             },
//         })
//         if (!user) {
//             return res.json({
//                 message: 'User is not found',
//             })
//         }
//         const isExists = await UserCourse.findOne({
//             where: {
//                 userId,
//                 courseId,
//             },
//         })
//
//         if (!isExists) {
//             return res.json({
//                 message: ' Такой пользователь не существует в курсе',
//             })
//         }
//         await course.removeUser(user)
//         return res.json({
//             message: 'Пользователь успешно удалено с курса',
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
//
// module.exports = {
//     getUsers,
//     getUserById,
//     createUser,
//     deleteUser,
//     addUserToCourse,
//     deleteUserFromCourse,
// }

const { UserModel, CourseModel, UserCourseModel } = require('../models/MongoModels');
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users || users.length === 0) {
            return res.json({
                message: 'No users found in the database',
            });
        }
        res.json({ users });
    } catch (error) {
        res.json({
            message: 'Error',
            error,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.json('Error', error);
    }
};


const createUser = async (req, res) => {
    try {
        const params = req.body;

        // Validate incoming parameters
        if (!params.name || !params.password) {
            return res.status(400).json({
                message: 'Invalid request. Missing required fields.',
            });
        }

        // Check if the user already exists
        const isExist = await UserModel.findOne({ name: params.name });

        if (isExist) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(params.password, 10); // 10 is the number of salt rounds

        // Create a new user with the hashed password
        const user = await UserModel.create({ ...params, password: hashedPassword });

        // Respond with success message and user data
        res.status(201).json({
            message: 'User successfully created!',
            user,
        });
    } catch (error) {
        console.error(error);

        // Respond with an error message and appropriate status code
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,  // Assuming you want to send the error message to the client
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const isExist = await UserModel.findById(userId);

        if (!isExist) {
            return res.json({
                message: 'User with this ID does not exist',
            });
        }

        await UserModel.findByIdAndDelete(userId);

        res.json({ message: 'Successfully deleted!' });
    } catch (error) {
        res.json({
            message: 'Error deleting user',
            error,
        });
    }
};

const addUserToCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.json({
                message: 'User or course is not provided',
                code: 401,
            });
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.json({
                message: 'Course not found',
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                message: 'User not found',
            });
        }

        const isUserExists = await UserCourseModel.findOne({ userId, courseId });

        if (isUserExists) {
            return res.json({ message: 'User already exists in the course' });
        }

        await UserCourseModel.create({ userId, courseId });
        return res.json({
            message: 'Successfully added to the course',
            user,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Error adding user to course',
            error,
        });
    }
};

const deleteUserFromCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.json({
                message: 'User or course is not provided',
                code: 401,
            });
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.json({
                message: 'Course not found',
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                message: 'User not found',
            });
        }

        const isExists = await UserCourseModel.findOne({ userId, courseId });

        if (!isExists) {
            return res.json({
                message: 'User does not exist in the course',
            });
        }

        await UserCourseModel.findOneAndDelete({ userId, courseId });
        return res.json({
            message: 'User successfully removed from the course',
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Error removing user from course',
            error,
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    addUserToCourse,
    deleteUserFromCourse,
};
