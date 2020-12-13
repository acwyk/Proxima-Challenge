const config = require('config');
const WebSocket = require('ws')
const binance = require('./binance.js');

let ws = binance.init_ws_streams(config.binance.ws);

ws.on('open', () => {
	console.log("WebSocket connected");
})

ws.on('close', () =>{
	console.log("WebSocket closed");
})

ws.on('message', (data) => {
	console.log("message");
	console.log(data);
})

ws.on('error', (err) => {
	console.log(err);
	process.exit(1);

})

binance.call_binance_api(config.binance.api).then((data) => {
	console.log("SUCCESS API");
	console.log(data);
}).catch((err) => {
	console.log("ERROR API");
	console.log(err);
});
