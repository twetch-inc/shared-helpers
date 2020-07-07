const Crypto = require('./crypto');

describe('crypto', () => {
	it('encrypt and decrypt string', () => {
		const value = `or don't, whatever`;
		const key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

		const encryptedValue = Crypto.aesEncrypt(value, key);
		const decryptedValue = Crypto.aesDecrypt(encryptedValue, key);

		expect(value).toBe(decryptedValue);
	});
});
