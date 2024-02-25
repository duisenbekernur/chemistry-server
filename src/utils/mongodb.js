const mongoose = require('mongoose');
const uri = "mongodb+srv://dernur0505daryn:AChtm4qiRRmaDBZU@cluster0.dporkur.mongodb.net/?retryWrites=true&w=majority";

const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

mongoose.connect(uri, clientOptions);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');

    mongoose.connection.db.admin().command({ping: 1}, (err, result) => {
        if (err) {
            console.error('Error pinging MongoDB:', err);
        } else {
            console.log('MongoDB ping successful:', result);
        }
    });
});



module.exports = mongoose