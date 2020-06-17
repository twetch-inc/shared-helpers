const axios = require('axios');

class ExchangeRate {
	constructor() {
		this.price = 100;
	}

	async init() {
		await this.fetch();

		setInterval(async () => {
			await this.fetch();
		}, 600000);
	}

	async fetch() {
		const response = await axios.get('https://cloud-functions.twetch.app/api/exchange-rate');
		this.price = parseFloat(response.data.price);
	}
}

const exchangeRate = new ExchangeRate();
exchangeRate.init();

module.exports = exchangeRate;
