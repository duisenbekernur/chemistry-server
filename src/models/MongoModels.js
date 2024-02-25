const mongoose = require('../utils/mongodb');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    // previewImg: {
    //     type: Buffer,
    //     required: false,
    // },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    devices: {
        type: [String],
        default: [],
    },
});

const UserCourseSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null,
    },
    courseId: {
        type: String,
        default: null,
    },
});

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answers: {
        type: [String],
        required: true,
    },
    answerIds: {
        type: [String],
        required: true,
    },
    videoId: {
        type: String,
        default: null,
    },
});

const VideoSchema = new mongoose.Schema({
    link: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        default: null,
    },
    size: {
        type: Number,
        default: null,
    },
    courseId: {
        type: String,
        default: null,
    },
});

const PassedQuestionsSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null,
    },
    videoId: {
        type: String,
        default: null,
    },
    userAnswers: {
        type: Object,
    },
    answerIds: {
        type: Array,
        required: true,
    },
    videoName: {
        type: String,
        required: true,
    },
});

const CourseModel = mongoose.model('Course', CourseSchema);
const UserModel = mongoose.model('User', UserSchema);
const UserCourseModel = mongoose.model('UserCourse', UserCourseSchema);
const QuestionModel = mongoose.model('Question', QuestionSchema);
const VideoModel = mongoose.model('Video', VideoSchema);
const PassedQuestionsModel = mongoose.model('PassedQuestions', PassedQuestionsSchema);

// UserModel.belongsToMany(CourseModel, { through: 'UserCourse' });
// CourseModel.belongsToMany(UserModel, { through: 'UserCourse' });
//
// CourseModel.hasMany(VideoModel);
// VideoModel.belongsTo(CourseModel);
//
// VideoModel.hasMany(QuestionModel);
// QuestionModel.belongsTo(VideoModel);


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB Atlas');

    // Create or update indexes here if needed
    // For example, UserModel.createIndexes();
    // ...

    // This will ensure that the collections are created automatically
    // based on the models you've defined
    // await CourseModel.sync();
    // await UserCourseModel.sync();
    // await UserModel.sync();
    // await QuestionModel.sync();
    // await VideoModel.sync();
    // await PassedQuestionsModel.sync();

    console.log('Database models synchronized successfully');
});

module.exports = {
    CourseModel,
    UserCourseModel,
    UserModel,
    QuestionModel,
    VideoModel,
    PassedQuestionsModel,
};
