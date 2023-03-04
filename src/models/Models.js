const { DataTypes, ARRAY, JSON } = require('sequelize')
const sequelize = require('../utils/db.js')

const CourseModel = sequelize.define('courses', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // previewImg: {
    //     type: sequelize.BLOB('long'),
    //     allowNull: true,
    // },
})

const UserModel = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
})

const UserCourse = sequelize.define('UserCourse', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
})

const QuestionModel = sequelize.define('questions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    answerIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
})

const VideoModel = sequelize.define('videos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
})

const PassedQuestions = sequelize.define('PassedQuestions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userAnswers: {
        type: DataTypes.JSON,
    },
    answerIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    videoName: { type: DataTypes.STRING, allowNull: false },
})

UserModel.belongsToMany(CourseModel, { through: UserCourse })
CourseModel.belongsToMany(UserModel, { through: UserCourse })

CourseModel.hasMany(VideoModel)
VideoModel.belongsTo(CourseModel)

VideoModel.hasMany(QuestionModel)
QuestionModel.belongsTo(VideoModel)

module.exports = {
    CourseModel,
    UserCourse,
    UserModel,
    QuestionModel,
    VideoModel,
    PassedQuestions,
}
