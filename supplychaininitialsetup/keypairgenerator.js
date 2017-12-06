var NodeRSA = require('node-rsa');
var fs = require('fs');
var jsonfile = require('jsonfile')

										
jsonfile.readFile('participants.json', function(err, participants) {
  
	if(err){
		console.log(err)
		
	}else{
			for(var i=0;i<participants.length;i++){
			
				var participant= participants[i];
				var keydata = fs.readFileSync(participant.keyspath);
				var publickeyHex = JSON.parse(keydata.toString()).publickey
				var multichain = require("multichain-node")({port: participant.port,
										host: "127.0.0.1",
										user: participant.user,
										pass: participant.pass});
				console.log(participant.multichainaddress+": "+participant.port);
				multichain.publishFrom({from:participant.multichainaddress, stream:"pubkeys", key:"publickey_"+participant.multichainaddress, data:publickeyHex},(err,tx) => {
					
						if(err){
							console.log(err);
						}else{
							console.log(tx);
						}
				});
			}
	}

})

//generation of keystore for all participants
/*for(var i = 0;i<4;i++){
	
	if(i==0){
	
		path = "./keystore/fdakeystore/"
		
	}else if(i==1){
	
		path = "./keystore/manfkeystore/"
		
	}else if(i==2){
	
		path = "./keystore/distkeystore/"
		
	}else{
	
		path = "./keystore/pharmkeystore/"
	}
	var key = new NodeRSA({b: 512});
	var privateKey = key.exportKey('pkcs8-private-pem');
	var publicKey = key.exportKey('pkcs8-public-pem');
	var hexprivateKey = new Buffer(privateKey).toString('hex');
	var hexpublicKey = new Buffer(publicKey).toString('hex');
	var obj = {
			privatekey:hexprivateKey,
			publickey:hexpublicKey
	}
	fs.writeFile(path+'credentials.pem', JSON.stringify(obj), function(err) {
		if(err) {
			return console.log(err);
		}
	
	});
}*/







//console.log("(Base64)Private Key: ",hexprivateKey)
//console.log("(Base64)Public Key: ",hexpublicKey)

/*privateKey = new Buffer(hexprivateKey, 'hex').toString('ascii')
publicKey = new Buffer(hexpublicKey, 'hex').toString('ascii')

var public_key = new NodeRSA();
public_key.importKey(publicKey, 'pkcs8-public-pem');
var encrypted = public_key.encrypt("Hello", 'base64');
console.log('encrypted: ', encrypted);

var private_key = new NodeRSA();
private_key.importKey(privateKey, 'pkcs8-private-pem');
var decrypted = private_key.decrypt(encrypted, 'utf-8');
console.log('decrypted: ', decrypted);

var signature  = private_key.sign("Hello", 'base64')
console.log('signature: ', signature);

var sigcheck = public_key.verify("Hello",signature,"utf8","base64")
console.log('verification: ', sigcheck);*/

/*var crypto = require('crypto');
var cipher = crypto.createDecipher('aes192', 'password');

var encrypted = cipher.update('some clear text data', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log("Encrypted(Hex): ",encrypted);

var decrypted = cipher.update(encrypted, 'hex', 'utf8');
decrypted += cipher.final('utf8');
console.log("decrypted: ",decrypted);*/
