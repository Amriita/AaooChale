const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const  config  = require('./config');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
require('./routes/app')(router);

app.use(
    bodyParser.urlencoded({
        extended: true,
        type: 'application/x-www-form-urlencoded'
    })
);


app.use('/', router);

try {
    console.log(process.env.MONGO_URI)
    //DB connect
   

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connection successful!');
    }).catch((e) => {
        console.log('Connection failed!');
    })

    server.listen(3000, function () {
        console.log(`API server listen at port 3000`);
    })

} catch (err) {
    console.log(JSON.stringify(err));
}

module.exports = server;