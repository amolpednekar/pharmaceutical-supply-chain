exports.drugTrade = function (req, response) {

	//console.log(response);
	var participant = participants[req.body.manufacturerID];
	//console.log(participants)
	var to = participants[req.body.receiverInfo]

	// Save manufacturer's address to post to use his stream
	var manufac = participants[1];
	var fda = participant[0];

	console.log("manufac_address", manufac.multichainaddress);
	console.log("to_address", to.multichainaddress);
	var multichain = require("multichain-node")({
		port: participant.port,
		host: "127.0.0.1",
		user: participant.user,
		pass: participant.pass
	});

	var drugtrade = {

		lotnumber: req.body.lotNumber,
		drugexpiratior: req.body.expirationDate,
		nationaldrugcode: req.body.ndc,
		manufacturer: { name: participant.name, labelercode: participant.labelercode, address: participant.address },
		unitsid: req.body.unitsId,
		quantity: req.body.quantity,
		productdetails: {
			name: req.body.productInfo.name,
			producttypename: req.body.productInfo.producttypename,
			proprietaryname: req.body.productInfo.proprietaryname,
			nonproprietaryname: req.body.productInfo.nonproprietaryname,
			dosageformname: req.body.productInfo.dosageformname,
			routename: req.body.productInfo.routename,
			strengthnumber: req.body.productInfo.strengthnumber,
			strengthunit: req.body.productInfo.strengthunit,
			productcode: req.body.productInfo.productcode
		}
	}
	var hash = new keccak()
	hash.update(JSON.stringify(drugtrade));
	var drug_trade_hash = hash.digest('hex')
	console.log("Hash of drug trade: ", drug_trade_hash);
	console.log("Hash of drug trade(Length): ", drug_trade_hash.length);
	var keydata = fs.readFileSync(participant.keyspath);
	var privatekeyHex = JSON.parse(keydata.toString()).privatekey
	//console.log("Private key(hex): ",privatekeyHex);
	var privateKey = new Buffer(privatekeyHex, 'hex').toString('ascii')
	//console.log("Private key(ascii): ",privateKey);

	var private_key = new NodeRSA();
	private_key.importKey(privateKey, 'pkcs8-private-pem');

	var signature = private_key.sign(drug_trade_hash.trim(), 'base64')
	//console.log('Signature on drugtrade : ', signature);

	var currentdate = new Date().getTime();

	var tradedetails = {};
	tradedetails.drugtrade = drugtrade;
	tradedetails.tradeflow = [{ sendername: participant.name, senderlabelercode: participant.labelercode, address: participant.address, sendersignature: signature, date: currentdate.toString(), recipientlabelercode: to.labelercode }]

	console.log("Trade Details: ", tradedetails);

	cipher = crypto.createCipher('aes192', drug_trade_hash);
	console.log("Trade details(JSON string): ", JSON.stringify(tradedetails))

	var encryptedtradedetails = cipher.update(JSON.stringify(tradedetails), 'utf8', 'hex');
	encryptedtradedetails += cipher.final('hex');

	console.log("Encrypted trade details: ", encryptedtradedetails)

	// post 
	multichain.subscribe({ stream: 'pubkeys' }, (err, res) => {

		if (err) {
			response.send({ success: 0, data: err });
		}
		console.log("Subscribe: ", res);

		console.log("To address: ", to.multichainaddress);
		multichain.listStreamPublisherItems({ stream: 'pubkeys', address: to.multichainaddress, verbose: true }, (err, items) => {

			if (err) {

				console.log(err)
				response.send({ success: 0, data: err });

			} else {

				var publickeyHex = items[items.length - 1].data;
				var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')

				var public_key = new NodeRSA();
				public_key.importKey(publicKey, 'pkcs8-public-pem');
				var encrypted_symkey = public_key.encrypt(drug_trade_hash, 'base64');
				console.log('Symkey encrypted: ', encrypted_symkey);

				multichain.subscribe({ stream: 'symkeys' }, (err, res) => {

					if (err) {
						console.log(err)
						response.send({ success: 0, data: err });

					} else {

						multichain.subscribe({ stream: 'drugstrades' }, (err, res) => {

							if (err) {
								console.log(err)
								response.send({ success: 0, data: err });
							} else {

								console.log("Time to put data onto streams");
								var encrypted_symkeyhex = new Buffer(encrypted_symkey).toString('hex');
								console.log('Symkey encrypted(Hex): ', encrypted_symkeyhex);
								//post encrypted sym key onto symkey stream
								//post encrypted trade data onto symkey stream
								multichain.publishFrom({ from: participant.multichainaddress, stream: "symkeys", key: drugtrade.lotnumber + "_" + to.multichainaddress, data: encrypted_symkeyhex }, (err, symkeytx) => {

									if (err) {
										console.log(err);
										response.send({ success: 0, data: err });

									} else {

										//tx of posting symmetric key
										console.log(symkeytx);
										console.log(typeof encryptedtradedetails);
										multichain.publishFrom({ from: participant.multichainaddress, stream: "drugstrades", key: drugtrade.lotnumber.toString(), data: encryptedtradedetails }, (err, drugstradetx) => {

											if (err) {

												console.log(err)
												response.send({ success: 0, data: err });

											} else {

												response.send({ success: 1, data: { drugstradetxid: drugstradetx, symkeytxid: symkeytx, lotnumber: req.body.lotNumber, recipientname: to.name } });
											}

										});

									}
								});

							}

						});
					}
				});
			}
		});


	});

	// post symmetric key encrypted by manufacterer's public key onto the symkeys stream 
	// so that he can also access this data
	multichain.subscribe({ stream: 'pubkeys' }, (err, res) => {

		if (err) {
			response.send({ success: 0, data: err });
		}
		console.log("Subscribe: ", res);

		console.log("To address: ", to.multichainaddress);
		multichain.listStreamPublisherItems({ stream: 'pubkeys', address: manufac.multichainaddress, verbose: true }, (err, items) => {

			if (err) {

				console.log(err)
				response.send({ success: 0, data: err });

			} else {

				var publickeyHex = items[items.length - 1].data;
				var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')

				var public_key = new NodeRSA();
				public_key.importKey(publicKey, 'pkcs8-public-pem');
				var encrypted_symkey = public_key.encrypt(drug_trade_hash, 'base64');
				console.log('Symkey encrypted: ', encrypted_symkey);

				multichain.subscribe({ stream: 'symkeys' }, (err, res) => {

					if (err) {
						console.log(err)
						response.send({ success: 0, data: err });

					} else {

						multichain.subscribe({ stream: 'drugstrades' }, (err, res) => {

							if (err) {
								console.log(err)
								response.send({ success: 0, data: err });
							} else {

								console.log("Time to put data onto streams");
								var encrypted_symkeyhex = new Buffer(encrypted_symkey).toString('hex');
								console.log('Symkey encrypted(Hex): ', encrypted_symkeyhex);
								//post encrypted sym key onto symkey stream
								//post encrypted trade data onto symkey stream
								multichain.publishFrom({ from: manufac.multichainaddress, stream: "symkeys", key: drugtrade.lotnumber + "_" + manufac.multichainaddress, data: encrypted_symkeyhex }, (err, symkeytx) => {

									if (err) {
										console.log(err);
										response.send({ success: 0, data: err });

									} else {
										console.log("manufacturer sym key success!")
									}

								});
							}
						});
					}
				});
			}
		});
		// TODO FDA CAN ACCESS THE DATA TOO! REPEAT ABOVE STEP WITH FDA's PubKey
	});
}
exports.drugVerify = function (req, response) {

	var lotnumber = req.params.lot;
	var caller = participants[req.params.callerid];
	var multichain = require("multichain-node")({
		port: caller.port,
		host: "127.0.0.1",
		user: caller.user,
		pass: caller.pass
	});


	multichain.subscribe({ stream: 'symkeys' }, (err, res) => {
		if (err) {

			response.send({ success: 0, data: err });
		} else {

			multichain.subscribe({ stream: 'drugstrades' }, (err, res) => {
				if (err) {

					response.send({ success: 0, data: err });

				} else {

					multichain.listStreamKeyItems({ stream: 'symkeys', key: lotnumber + "_" + caller.multichainaddress, verbose: true }, (err, symkeyitems) => {

						console.log("Symm key Items: ", symkeyitems);
						if (symkeyitems.length < 1) {

							response.status(404)
							response.send({ success: 0, data: "Invalid lot number" });

						} else {
							var symkeyHex = symkeyitems[symkeyitems.length - 1];
							console.log('Symkey encrypted(Hex): ', symkeyHex.data);
							var symkeyencrypted = new Buffer(symkeyHex.data, 'hex').toString('ascii')
							console.log('Symkey encrypted(Base64): ', symkeyencrypted);
							var keydata = fs.readFileSync(caller.keyspath);
							var privatekeyHex = JSON.parse(keydata.toString()).privatekey
							console.log("Privatekeyhex: ", privatekeyHex);
							var privateKey = new Buffer(privatekeyHex, 'hex').toString('ascii')
							var private_key = new NodeRSA();
							private_key.importKey(privateKey, 'pkcs8-private-pem');

							var decryptedsymkey = private_key.decrypt(symkeyencrypted, 'utf-8');
							console.log('Symkey decrypted: ', decryptedsymkey);
							console.log('Symkey decrypted(Length): ', decryptedsymkey.length);

							multichain.listStreamKeyItems({ stream: 'drugstrades', key: lotnumber.toString(), verbose: true }, (err, drugtrades) => {

								var hexdrugtrade = drugtrades[drugtrades.length - 1].data;
								console.log("Drug trade(Hex): ", hexdrugtrade);

								decipher = crypto.createDecipher('aes192', decryptedsymkey.trim());
								var decrypteddrugtrade = decipher.update(hexdrugtrade, 'hex', 'utf8');
								decrypteddrugtrade += decipher.final('utf8');
								console.log("Drug trade(Decrypted): ", decrypteddrugtrade);
								var drugTradeobj = JSON.parse(decrypteddrugtrade);
								var drugTradeFlow = drugTradeobj.tradeflow;

								var hash = new keccak()
								hash.update(JSON.stringify(drugTradeobj.drugtrade));
								var drug_trade_hash = hash.digest('hex')
								console.log("Hash of drug trade: ", drug_trade_hash);
								for (i = 0; i < drugTradeFlow.length; i++) {

									verify(drugTradeFlow, i, drug_trade_hash, multichain, response, drugTradeobj)
								}

							});
						}

					});
				}
			});
		}
	});

};

exports.updatedrugTrade = function (req, response) {

	console.log(req)
	var tradedetails = req.body.tradeDetails;
	var caller = participants[req.body.senderId];
	var to = participants[req.body.pharamacyId];

	var multichain = require("multichain-node")({
		port: caller.port,
		host: "127.0.0.1",
		user: caller.user,
		pass: caller.pass
	});

	var lotnumber = tradedetails.drugtrade.lotnumber;
	var hash = new keccak()
	hash.update(JSON.stringify(tradedetails.drugtrade));
	var drug_trade_hash = hash.digest('hex')
	console.log("Hash of drug trade: ", drug_trade_hash);

	var keydata = fs.readFileSync(caller.keyspath);
	var privatekeyHex = JSON.parse(keydata.toString()).privatekey
	console.log("Private key(hex): ", privatekeyHex);
	var privateKey = new Buffer(privatekeyHex, 'hex').toString('ascii')
	console.log("Private key(ascii): ", privateKey);

	var private_key = new NodeRSA();
	private_key.importKey(privateKey, 'pkcs8-private-pem');

	var signature = private_key.sign(drug_trade_hash.trim(), 'base64')
	//console.log('Signature on drugtrade : ', signature);

	var currentdate = new Date().getTime();

	var tradeflow = tradedetails.tradeflow;
	tradeflow.push({ recipientname: caller.name, recipientlabelercode: caller.labelercode, address: caller.address, recipientsignature: signature, date: currentdate.toString() });

	if (to != null) {

		tradeflow.push({ sendername: caller.name, senderlabelercode: caller.labelercode, address: caller.address, sendersignature: signature, date: currentdate.toString(), recipientlabelercode: to.labelercode })

	}
	tradedetails.tradeflow = tradeflow;
	console.log("Trade Details: ", tradedetails);

	cipher = crypto.createCipher('aes192', drug_trade_hash);
	console.log("Trade details(JSON string): ", JSON.stringify(tradedetails))

	var encryptedtradedetails = cipher.update(JSON.stringify(tradedetails), 'utf8', 'hex');
	encryptedtradedetails += cipher.final('hex');

	console.log("Encrypted trade details: ", encryptedtradedetails)

	if (to == null) {

		multichain.publishFrom({ from: caller.multichainaddress, stream: "drugstrades", key: lotnumber.toString(), data: encryptedtradedetails }, (err, drugstradetx) => {

			if (err) {

				console.log(err)
				response.send({ success: 0, data: err });

			} else {

				response.send({ success: 1, data: { drugstradetxid: drugstradetx, lotnumber: req.body.lotNumber } });
			}
		});


	} else {
		console.log("To address: ", to.multichainaddress);
		multichain.listStreamPublisherItems({ stream: 'pubkeys', address: to.multichainaddress, verbose: true }, (err, items) => {

			if (err) {

				console.log(err)
				response.send({ success: 0, data: err });

			} else {

				var publickeyHex = items[items.length - 1].data;
				var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')

				var public_key = new NodeRSA();
				public_key.importKey(publicKey, 'pkcs8-public-pem');
				var encrypted_symkey = public_key.encrypt(drug_trade_hash, 'base64');
				console.log('Symkey encrypted: ', encrypted_symkey);
				console.log("Time to put data onto streams");
				var encrypted_symkeyhex = new Buffer(encrypted_symkey).toString('hex');
				console.log('Symkey encrypted(Hex): ', encrypted_symkeyhex);
				//post encrypted sym key onto symkey stream
				//post encrypted trade data onto symkey stream
				multichain.publishFrom({ from: caller.multichainaddress, stream: "symkeys", key: lotnumber + "_" + to.multichainaddress, data: encrypted_symkeyhex }, (err, symkeytx) => {

					if (err) {
						console.log(err);
						response.send({ success: 0, data: err });

					} else {

						console.log(symkeytx);
						console.log(typeof encryptedtradedetails);
						multichain.publishFrom({ from: caller.multichainaddress, stream: "drugstrades", key: lotnumber.toString(), data: encryptedtradedetails }, (err, drugstradetx) => {

							if (err) {

								console.log(err)
								response.send({ success: 0, data: err });

							} else {

								response.send({ success: 1, data: { drugstradetxid: drugstradetx, symkeytxid: symkeytx, lotnumber: req.body.lotNumber, recipientname: to.name } });
							}

						});

					}
				});
			}
		});
	}
};

exports.recallDrug = function (req, response) {

	console.log(req)
	var tradedetails = req.body.tradeDetails;
	var caller = participants[req.body.senderId];
	var to = participants[req.body.pharamacyId];

	var multichain = require("multichain-node")({
		port: caller.port,
		host: "127.0.0.1",
		user: caller.user,
		pass: caller.pass
	});

	var lotnumber = tradedetails.drugtrade.lotnumber;
	var hash = new keccak()
	hash.update(JSON.stringify(tradedetails.drugtrade));
	var drug_trade_hash = hash.digest('hex')
	console.log("Hash of drug trade: ", drug_trade_hash);

	var keydata = fs.readFileSync(caller.keyspath);
	var privatekeyHex = JSON.parse(keydata.toString()).privatekey
	console.log("Private key(hex): ", privatekeyHex);
	var privateKey = new Buffer(privatekeyHex, 'hex').toString('ascii')
	console.log("Private key(ascii): ", privateKey);

	var private_key = new NodeRSA();
	private_key.importKey(privateKey, 'pkcs8-private-pem');

	var signature = private_key.sign(drug_trade_hash.trim(), 'base64')
	//console.log('Signature on drugtrade : ', signature);

	var currentdate = new Date().getTime();
	trade = {};
	trade.drugtrade = tradedetails.drugtrade;
	console.log("Drug Trade Obj", trade.drugtrade);
	trade.signature = signature;

	console.log("Trade details(JSON string): ", JSON.stringify(trade))

	var unencryptedDrugData = new Buffer(JSON.stringify(trade));
	var unencryptedDrugDataHex = unencryptedDrugData.toString('hex');

	multichain.publishFrom({ from: caller.multichainaddress, stream: "recalleddrugstrades", key: lotnumber.toString(), data: unencryptedDrugDataHex }, (err, drugstradetx) => {
		if (err) {
			console.log(err)
			response.send({ success: 0, data: err });

		} else {
			console.log("Posted to recalled drugs stream!")
			response.send({ success: 1, data: { drugstradetxid: drugstradetx, lotnumber: req.body.lotNumber } });
		}
	});
};


function getMultichainAddress(labelercode) {

	for (i = 0; i < participants.length; i++) {

		var participant = participants[i];
		if (participant.labelercode == labelercode) {

			return participant.multichainaddress;
		}
	}
	return null;
}

function verify(drugTradeFlow, i, drug_trade_hash, multichain, response, drugTradeobj) {


	multichain.subscribe({ stream: 'pubkeys' }, (err, res) => {

		if (err) {

			response.send({ success: 0, data: err });

		} else {
			var tradeFlow = drugTradeFlow[i];
			if (tradeFlow.senderlabelercode != null) {

				labelercode = tradeFlow.senderlabelercode;
				signature = tradeFlow.sendersignature;

			} else {

				labelercode = tradeFlow.recipientlabelercode;
				signature = tradeFlow.recipientsignature;
			}
			for (j = 0; j < participants.length; j++) {

				var participant = participants[j];
				if (participant.labelercode == labelercode) {

					multichainaddress = participant.multichainaddress;
				}
			}
			multichain.listStreamPublisherItems({ stream: 'pubkeys', address: multichainaddress, verbose: true }, (err, items) => {

				if (err) {

					console.log(err)
					response.send({ success: 0, data: err });

				} else {
					var tradeFlow1 = drugTradeFlow[i];
					if (tradeFlow1.senderlabelercode != null) {

						signature = tradeFlow1.sendersignature;

					} else {

						signature = tradeFlow1.recipientsignature;
					}
					var publickeyHex = items[items.length - 1].data;
					console.log("Publickey (Hex)" + multichainaddress + " " + labelercode + " " + i + " : ", publickeyHex);
					var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')
					var public_key = new NodeRSA();
					public_key.importKey(publicKey, 'pkcs8-public-pem');
					var signcheck = public_key.verify(drug_trade_hash, signature, "utf8", "base64");
					console.log("Signature Status: ", signcheck)

					if (signcheck) {

						if (i == drugTradeFlow.length - 1) {

							console.log(drugTradeFlow.length - 1)
							response.send({ success: 1, data: { tradedetails: drugTradeobj, verificationstatus: true } });

						}
					} else {

						response.send({ success: 0, data: "Verification failed" });

					}
				}
			});
		}
	});
}

exports.recallDrugVerify = function (req, response) {

	var lotnumber = req.params.lot;
	var caller = participants[req.params.callerid];
	var signatureVerify = participants[1];	// 0 for FDA
	console.log("caller", caller);
	var multichain = require("multichain-node")({
		port: caller.port,
		host: "127.0.0.1",
		user: caller.user,
		pass: caller.pass
	});

	multichain.subscribe({ stream: 'recalleddrugstrades' }, (err, res) => {
		if (err) {
			console.log(error);
			response.send({ success: 0, data: err });
		}
		else {
			multichain.listStreamKeyItems({ stream: 'recalleddrugstrades', key: lotnumber.toString(), verbose: true }, (err, drugtrades) => {
				if (drugtrades.length < 1) {
					response.status(404)
					response.send({ success: 0, data: "Invalid lot number" });
				} else {
					var hexdrugtrade = drugtrades[drugtrades.length - 1].data;
					console.log("Drug trade(Hex): ", hexdrugtrade);
					buf = new Buffer(hexdrugtrade, "hex");
					console.log(buf);
					console.log("\n\nAscii", buf.toString('ascii'));
					drugTradeobj = JSON.parse(buf.toString('ascii'));

					// Signature Verification
					multichainaddress = signatureVerify.multichainaddress;

					// hashing the drugtrade object
					var hash = new keccak()
					hash.update(JSON.stringify(drugTradeobj.drugtrade));
					var drug_trade_hash = hash.digest('hex')
					signature = drugTradeobj.signature;
					multichain.listStreamPublisherItems({ stream: 'pubkeys', address: multichainaddress, verbose: true }, (err, items) => {
						if (err) {
							console.log(err)
							response.send({ success: 0, data: err });
						} else {
							var publickeyHex = items[items.length - 1].data;
							var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')
							var public_key = new NodeRSA();
							public_key.importKey(publicKey, 'pkcs8-public-pem');
							var signcheck = public_key.verify(drug_trade_hash, signature, "utf8", "base64");
							console.log("Signature Status: ", signcheck)
							response.send({ success: 1, data: { tradedetails: drugTradeobj, verificationstatus: true } });
						}
					});
				}
			});
		}
	});
};

function verifyRevoked(signature, drug_trade_hash, multichain, response, drugTradeobj) {
	console.log("Verifying revoked item!")

	multichain.subscribe({ stream: 'pubkeys' }, (err, res) => {

		if (err) {

			response.send({ success: 0, data: err });

		} else {
			multichainaddress = participant[1].multichainaddress;

			multichain.listStreamPublisherItems({ stream: 'pubkeys', address: multichainaddress, verbose: true }, (err, items) => {

				if (err) {

					console.log(err)
					response.send({ success: 0, data: err });

				} else {

					var publickeyHex = items[items.length - 1].data;
					console.log("Publickey (Hex)" + multichainaddress + " " + labelercode + " " + i + " : ", publickeyHex);
					var publicKey = new Buffer(publickeyHex, 'hex').toString('ascii')
					var public_key = new NodeRSA();
					public_key.importKey(publicKey, 'pkcs8-public-pem');
					var signcheck = public_key.verify(drug_trade_hash, signature, "utf8", "base64");
					console.log("Signature Status: ", signcheck)

					if (signcheck) {
						console.log("verification successful");
						if (i == drugTradeFlow.length - 1) {

							console.log(drugTradeFlow.length - 1)
							response.send({ success: 1, data: { tradedetails: drugTradeobj, verificationstatus: true } });

						}
					} else {

						response.send({ success: 0, data: "Verification failed" });

					}
				}
			});
		}
	});
}