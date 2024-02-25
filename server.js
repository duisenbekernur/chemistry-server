const express = require('express')
const AdminRoutes = require('./src/routes/AdminRouter.js')
const UserRoutes = require('./src/routes/UserRouter.js')
const CourseRoutes = require('./src/routes/CourseRouter.js')
const sequelize = require('./src/utils/db.js')
const mongo = require('./src/utils/mongodb.js')
const cors = require('cors')
const port = 8000

const app = express()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.use(cors())

app.use(express.json())
app.use('/node-api/admin', AdminRoutes)
app.use('/node-api/user', UserRoutes)
app.use('/node-api/course', CourseRoutes)

// ;(async () => {
//     await sequelize.sync({ force: true })
//     console.log('Tables have been created')
// })()

app.listen(port, () => console.log('App started'))
