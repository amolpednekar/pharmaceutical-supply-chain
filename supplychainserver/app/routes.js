/**
 * File    : /server/app/routes.js
 * Purpose : Define the URL routes
 */
module.exports = function (app) {


	bcManager = require('./modules/blockchain/blockchainOperations.js')
    app.post('/drugtrade', bcManager.drugTrade);
	app.get('/drug/:lot/:callerid/verify',bcManager.drugVerify);
	app.put('/drugtrade', bcManager.updatedrugTrade);
	app.put('/drugrecall',bcManager.recallDrug);
	app.get('/drugrecall/:lot/:callerid/verify',bcManager.recallDrugVerify);
};
