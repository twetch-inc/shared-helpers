const regex = require('./regex');
const hash = 'ced6ebb54f1b49577b855d117e1ed89473f9cb71341f66daaeee47c9c78ac3e7';

describe('regex', () => {
	it('match bitcoinfiles preview', () => {
		const match = regex.match(`https://bitcoinfiles.org/t/${hash}`, 'BITCOIN_FILES_PREVIEW_REGEX');

		expect(match[3]).toBe(hash);
		expect(!!match).toBe(true);
	});

	it('match bitcoinfiles', () => {
		const match = regex.match(`https://media.bitcoinfiles.org/${hash}`, 'BITCOIN_FILES_REGEX');

		expect(match[3]).toBe(hash);
		expect(!!match).toBe(true);
	});

	it('doesnt match bitcoinfiles', () => {
		const match = regex.match(`https://bitcoinfiles.org/t/${hash}`, 'BITCOIN_FILES_REGEX');
		expect(!match).toBe(true);
	});
});
