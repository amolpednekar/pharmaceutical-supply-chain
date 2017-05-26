express = require('express');
bodyParser = require('body-parser');
NodeRSA = require('node-rsa');
fs = require('fs');
jsonfile = require('jsonfile')
keccak = require('keccakjs')
crypto = require('crypto');
var app = express();

//application data variables

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});
initialConfig();
app.use(bodyParser.json());
require('./app/routes.js')(app);
app.listen(8080);
console.log('Supply Chain Server listening on port 8080');

function initialConfig(){

	jsonfile.readFile('participants.json', function(err, parti) {
  
		if(err){
			console.log(err)
			
		}else{
			console.log("Participants set successfully");
			participants = parti;
		}
		
	})
}