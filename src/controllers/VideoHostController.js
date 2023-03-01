const { google } = require('googleapis')
const multer = require('multer')
const OAuth2Data = require('../../credentials.json')

const storage = multer.diskStorage({
    destination: '/',
})

const CLIENT_ID = OAuth2Data.web.client_id
const CLIENT_SECRET = OAuth2Data.web.client_secret
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0]

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
)

let authed = false

const authorizeGoogle = (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile',
        ],
    })

    res.json({ authUrl })
}

const getGoogleAuthToken = (req, res) => {
    // res.redirect('http://127.0.0.5173/client/admin')
    const { code } = req.query

    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.error('Error getting OAuth2 tokens:', err)
            return res.status(500).send('Error getting OAuth2 tokens')
        }

        oauth2Client.setCredentials(tokens)
        console.log(oauth2Client.credentials.id_token)
        console.log(oauth2Client)
        res.redirect('http://127.0.0.1:5173/client/admin')
    })
}

// app.post('/upload', upload.single('video'), (req, res) => {
//     const { title, description } = req.body
//     const privacyStatus = 'private'

//     const youtube = google.youtube({
//         version: 'v3',
//         auth: oauth2Client,
//     })

//     youtube.videos.insert(
//         {
//             part: 'snippet,status',
//             requestBody: {
//                 snippet: {
//                     title,
//                     description,
//                 },
//                 status: {
//                     privacyStatus,
//                 },
//             },
//             media: {
//                 body: req.file.buffer,
//             },
//         },
//         (err, result) => {
//             if (err) {
//                 console.error('Error uploading video:', err)
//                 return res.status(500).send('Error uploading video')
//             }

//             res.send('Video uploaded successfully!')
//         }
//     )
// })

module.exports = { authorizeGoogle, getGoogleAuthToken }
