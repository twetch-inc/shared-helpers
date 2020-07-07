const Aes = require('aes-js');

class Crypto {
	static aesEncrypt(plainText, key) {
		const plainBytes = Aes.utils.utf8.toBytes(plainText);
		const aes = new Aes.ModeOfOperation.ctr(key);
		const encryptedBytes = aes.encrypt(plainBytes);
		const encryptedHex = Aes.utils.hex.fromBytes(encryptedBytes);

		return encryptedHex;
	}

	static aesDecrypt(encryptedHex, key) {
		const encryptedBytes = Aes.utils.hex.toBytes(encryptedHex);
		const aes = new Aes.ModeOfOperation.ctr(key);
		const plainBytes = aes.decrypt(encryptedBytes);
		const plainText = Aes.utils.utf8.fromBytes(plainBytes);

		return plainText;
	}
}

module.exports = Crypto;
