const axios = require('axios');

class AuthApi {
	constructor(req) {
		this.client = axios.create({
			baseURL: 'https://auth.twetch.com',
		});
	}

	getClient() {
		return this.client;
	}

	async challenge() {
		const r = await this.client.get('/api/v1/challenge');
		return r.data.message;
	}

	async authenticate(payload) {
		const r = await this.client.post('/api/v1/authenticate', payload);
		return r.data.token;
	}

	async me(payload) {
		const r = await this.client.post('/api/v1/me', payload);
		return r.data;
	}
}

module.exports = new AuthApi();
