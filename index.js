const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const config = require('config');
const WebSocket = require('ws');
const binance = require('./binance.js');


const argv = process.argv.slice(2);

// Define needed vars
// btc_qty is quantity of BTC to buy/sell
let qty_btc;
let snapshot, stream_item;

// only used for help
console.log('qty_btc', qty_btc)
console.log('argv', argv)

if (argv[0] === undefined){
	console.log("Undefined quantity. Exiting with Error.");
	process.exit(1);
}
else {
	qty_btc = Number(argv[0]);
	initalize();
	console.log(qty_btc)
}

function initalize(){

	binance.call_binance_api(config.binance.api).then((_data) => {
		console.log("SUCCESS");
		snapshot = _data.data;
	}).catch((err) => {
		console.log("API Error. Exiting");
		console.log(err);
		process.exit(1);
	});

	//#region basic WebSocket operations (open, message, close, error)
	// Define WebSocket connection based on configuration file
	let ws = binance.init_ws_streams(config.binance.ws);

	ws.on('message', (_data) => {
		console.log("message");
		if (stream_item === undefined){
			// denotes initial item in stream as per 
			// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#how-to-manage-a-local-order-book-correctly
			if (_data.U <= (snapshot.lastUpdateId +1) && _data.u >= (snapshot.lastUpdateId + 1)){
				stream_item = _data;	
			}
		}
		if (_data.U > snapshot.lastUpdateId){
			stream_item = _data;
		}
		console.log(stream_item);
	})

	ws.on('close', () =>{
		console.log("WebSocket closed. Exiting.");
		process.exit(1);
	})

	ws.on('error', (err) => {
		console.log("WebSocket Error. Exiting.");
		console.log(err);
		process.exit(1);

	})
	//#endregion

	
}


