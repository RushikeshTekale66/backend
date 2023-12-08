const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/Inotebook";

const connectToMongo = () => {
    // mongoose.connect(mongoURI, ()=>{
    //     console.log("connected to mongodb!");
    // })

    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
        });

}

module.exports = connectToMongo;