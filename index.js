const config = require('./config/default.json')
const binance = require('./binance.js');

const argv = process.argv.slice(2);

// Define needed vars
// qty_btc is quantity of BTC to buy/sell
let qty_btc;
let snapshot, stream_item;
let avg_asks, avg_bids;
let prev_event_u;

if (argv[0] === undefined){
	console.log("Undefined quantity. Exiting with Error.");
	process.exit(1);
}
else {
	qty_btc = Number(argv[0]);
	// Define websocket stream here.
	let ws = binance.init_ws_streams(config.binance.ws);
	binance.call_binance_api(config.binance.api).then(result => {
		snapshot = result;
	}).catch(err => {
		console.log(err);
		process.exit(1);
	});

	ws.on('message', (_data) => {
		let data = JSON.parse(_data);
		let bid_ask_price = process_ws_data(data, qty_btc);
		console.clear();
		console.log(`BTC Offered: ${qty_btc} Bid Price: ${bid_ask_price[0]} | Ask Price: ${bid_ask_price[1]}`);
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
}


function process_ws_data(data, qty_btc){
	let bid_ask_price = [0, 0]; // default 0 value of array
	if (stream_item === undefined){
		// denotes initial item in stream as per 
		// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#how-to-manage-a-local-order-book-correctly
		if (data.U <= (snapshot.lastUpdateId + 1) && data.u >= (snapshot.lastUpdateId + 1)){
			stream_item = data;	
			prev_event_u = data.u;
		}
	}
	// if (prev_event_u === undefined || )
	else if (data.u > snapshot.lastUpdateId){
		stream_item = data;
		prev_event_u = data.u;
	}
	if (stream_item !== undefined){
		avg_asks = calculate_avg_price(stream_item.a, qty_btc);
		avg_bids = calculate_avg_price(stream_item.b, qty_btc);
		bid_ask_price = [avg_asks, avg_bids];
	}
	return bid_ask_price;
}

function calculate_avg_price(price_array, qty_btc){
	let sum_avg_price = 0;
	if (price_array.length === 0 || price_array === undefined){
		return 0;
	}
	for (let index = 0; index < price_array.length; index++) {
		const element = price_array[index];
		sum_avg_price += (element[0] / element[1]);
	}

	return qty_btc / sum_avg_price;
}