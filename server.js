const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();
const port = 3000;


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