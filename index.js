const config = require('config');
const websocket = require('ws')
const binance = require('./binance.js');

console.log(config);

binance.init(config.binance);

if (binance.isInit() == undefined) {
	console.log("Binance Uninitialized...");
	process.exit(1);
}

console.logs(binance);
