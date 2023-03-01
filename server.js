const express = require('express')
const AdminRoutes = require('./src/routes/AdminRouter.js')
const UserRoutes = require('./src/routes/UserRouter.js')
const CourseRoutes = require('./src/routes/CourseRouter.js')
const sequelize = require('./src/utils/db.js')
const cors = require('cors')
const port = 8000

const {
    getGoogleAuthToken,
} = require('./src/controllers/VideoHostController.js')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.use(cors())

app.use(express.json())
app.use('/api/admin', AdminRoutes)
app.use('/api/user', UserRoutes)
app.use('/api/course', CourseRoutes)

// ;(async () => {
//     await sequelize.sync({ force: true })
//     console.log('Tables have been created')
// })()

app.get('/google/callback', getGoogleAuthToken)
app.listen(port, () => console.log('App started'))
