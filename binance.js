const axios = require('axios');
const WebSocket = require('ws');

function init_ws_streams(config){
	let ws_url = `${config.uri}:${config.port}/${config.uri_ext}/${config.streams.bnbbtc}@depth@${config.update_speed_ms}ms`;
	ws = new WebSocket(ws_url);

	ws.on('open', () => {
	})

	ws.on('error', (err) => {
		console.log(err);
		process.exit(1);

	})

	return ws;
}

function call_binance_api(config){
	let api_url = `${config.uri}?symbol=${config.symbols.bnbbtc}&limit=${config.limit}`;
	return new Promise(async (resolve, reject) => {
		await axios.get(api_url, {
			method: 'GET'
		}).then(response  => {
			resolve(response.data);
		}).catch((err) => {
			console.log(err);
			reject({});
		})
	});
}


module.exports = {
	init_ws_streams: init_ws_streams,
	call_binance_api: call_binance_api
};


