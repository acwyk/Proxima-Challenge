const config = require('./config/default.json')
const binance = require('./binance.js');

const argv = process.argv.slice(2);

// Define needed vars
// btc_qty is quantity of BTC to buy/sell
let qty_btc;
let snapshot, stream_item;
let avg_asks, avg_bids;
// only used for help
console.log('qty_btc', qty_btc)
console.log('argv', argv)

if (argv[0] === undefined){
	console.log("Undefined quantity. Exiting with Error.");
	process.exit(1);
}
else {
	qty_btc = Number(argv[0]);
	binance.call_binance_api(config.binance.api).then(result => {
		snapshot = result;
		//#region basic WebSocket operations (open, message, close, error)
		// Define WebSocket connection based on configuration file
		let ws = binance.init_ws_streams(config.binance.ws);

		ws.on('message', (_data) => {
			console.log("message");
			let data = JSON.parse(_data);
			if (stream_item === undefined){
				// denotes initial item in stream as per 
				// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#how-to-manage-a-local-order-book-correctly
				if (data.U <= (snapshot.lastUpdateId +1) && data.u >= (snapshot.lastUpdateId + 1)){
					stream_item = data;	
				}
			}
			if (data.U > snapshot.lastUpdateId){
				stream_item = data;
			}
			console.log(stream_item);
			avg_asks = stream_item.a;
			avg_bids = stream_item.b;
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
	}).catch(err => {
		console.log("Error in API Call.");
		console.log(err);
		process.exit(1);
	});
	
}


