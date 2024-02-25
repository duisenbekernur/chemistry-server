const express = require('express')
const AdminRoutes = require('./src/routes/AdminRouter.js')
const UserRoutes = require('./src/routes/UserRouter.js')
const CourseRoutes = require('./src/routes/CourseRouter.js')
const sequelize = require('./src/utils/db.js')
const mongo = require('./src/utils/mongodb.js')
const cors = require('cors')
const https = require("https");
const fs = require("fs");
const port = 8000

const app = express()
const server = https.createServer(
    {
        key: fs.readFileSync(
            "/etc/letsencrypt/archive/ems-app.kz/privkey1.pem",
            "utf8"
        ),
        cert: fs.readFileSync(
            "/etc/letsencrypt/archive/ems-app.kz/cert1.pem",
            "utf8"
        ),
    },
    app
);

app.get('/', (req, res) => {
    res.send('Hello')
})

const allowedOrigins = [
    'https://node-final.ems-app.kz'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
}));

app.use(express.json())
app.use('/node-api/admin', AdminRoutes)
app.use('/node-api/user', UserRoutes)
app.use('/node-api/course', CourseRoutes)

// ;(async () => {
//     await sequelize.sync({ force: true })
//     console.log('Tables have been created')
// })()

server.listen(port, () => console.log('App started'))
