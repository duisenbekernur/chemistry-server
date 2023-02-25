const { DataTypes, ARRAY } = require('sequelize')
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
})

const VideoModel = sequelize.define('VideoModel', {
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

UserModel.belongsToMany(CourseModel, { through: UserCourse })
CourseModel.belongsToMany(UserModel, { through: UserCourse })

CourseModel.hasMany(VideoModel)
VideoModel.belongsTo(CourseModel)

VideoModel.hasMany(QuestionModel)
QuestionModel.belongsTo(VideoModel)

module.exports = { CourseModel, UserCourse, UserModel, QuestionModel }
