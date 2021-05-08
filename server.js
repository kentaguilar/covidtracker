var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var details = require('./routes/details');

var port = 3000;
var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set static folder
app.use(express.static(path.join(__dirname, 'ng/dist/client')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', details);

app.listen(port, function(){
    console.log('Covid Tracker started on port ' + port);
});