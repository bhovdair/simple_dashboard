const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app = express();
const port = 3000;

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "simplekey010101",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// cookie parser middleware
app.use(cookieParser());


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/', require('./routes/web'));
app.use("/assets",express.static(__dirname + "/assets"));
app.use('/file',express.static(__dirname +'/node_modules'));

const database = "mongodb://localhost:27017/simple_dashboard";
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('db connected.'))
.catch(err => console.log('db not connected. err :' + err));

app.listen(port, () => {
    console.log(`Our server is running on port ${port}`);
  });