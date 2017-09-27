const parser = require('json-parser');
const notifications = require('./notifications')
console.log("Listener Triggered!");

args = process.argv.slice(2);
	if(parseInt(args[1]) === 1){
		console.log("Transaction Seen!");
		//console.log("myArgs.length",args.length);

		var concatString = "";

		for(i=2;i<args.length;i++){
		  concatString += args[i];
		}
		
		prefix = "items"
		postfix = ']},{"value'
		
		//console.log("\n\nconcatString",concatString)
		
		extractedString = concatString.substring(concatString.indexOf(prefix)+8,concatString.indexOf(postfix))
		//console.log("\n\extractedString",extractedString);

		extractedStringJson = parser.parse(extractedString);
		//console.log("\n\nextractedStringJson",extractedStringJson);

		if(extractedStringJson.name == "recalleddrugstrades"){
			to = "blockchaingoa@persistent.co.in";
			buf = new Buffer(extractedStringJson.data, "hex");
			//console.log("\n\nAscii", buf.toString('ascii'));
			drugTradeobj = JSON.parse(buf.toString('ascii'));
			//console.log("\n\nParsedJson", drugTradeobj);
			lotNumber = drugTradeobj.drugtrade.lotnumber;
			numberOfUnits = drugTradeobj.drugtrade.unitsid.length;
			for(i=0;i<numberOfUnits;i++){
				console.log(lotNumber+"-"+drugTradeobj.drugtrade.unitsid[i]+" has been revoked!");
				msg = lotNumber+"-"+drugTradeobj.drugtrade.unitsid[i]+" has been recalled!"
				
				if(process.env.emailEnabled){	// flag to enable/disable emails
					notifications.sendEmail(to,msg);	//send email for every lot!
				}
			}
		}

	}	

