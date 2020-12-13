const axios = require('axios');
const WebSocket = require('ws');

function init_ws_streams(config){
	let ws_url = `${config.uri}:${config.port}/${config.uri_ext}/${config.streams.bnbbtc}@depth`;
	console.log(ws_url)
	ws = new WebSocket(ws_url);
	return ws;
}

function call_binance_api(config){
	let api_url = `${config.uri}?symbol=${config.symbols.bnbbtc}&limit=${config.limit}`;
	console.log(api_url);
	return new Promise(async (resolve, reject) => {
		await axios.get(api_url, {
			method: 'GET'
		}).then(response  => {
			console.log("SUCCESS");
			resolve(response);
		}).catch((err) => {
			console.log("ERROR");
			reject(err);
		})
	});
}


module.exports = {
	init_ws_streams: init_ws_streams,
	call_binance_api: call_binance_api
};


