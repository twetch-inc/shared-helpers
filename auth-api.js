const axios = require('axios');

class AuthApi {
	constructor(options) {
		this.client = axios.create({
			baseURL: 'https://auth.twetch.app',
			...options
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

	async paymail() {
		const r = await this.client.get('/api/v1/me/paymail');
		return r.data.paymail;
	}

	async approved() {
		try {
			const r = await this.client.get('/api/v1/me/approved');
			return !!r.data.approved;
		} catch (e) {
			return false;
		}
	}

	async publicKeys(userId) {
		const r = await this.client.get(`/api/v1/users/${userId}/public-keys`);
		return r.data.public_keys || [];
	}
}

module.exports = AuthApi;
