const moongose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await moongose.connect(db, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB Connected...');
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
