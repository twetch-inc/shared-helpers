const Aes = require('aes-js');

class Crypto {
	static aesEncrypt(plainText, key) {
		const plainBytes = Aes.utils.utf8.toBytes(encodeURIComponent(plainText));
		const aes = new Aes.ModeOfOperation.ctr(key);
		const encryptedBytes = aes.encrypt(plainBytes);
		const encryptedHex = Aes.utils.hex.fromBytes(encryptedBytes);

		return encryptedHex;
	}

	static aesDecrypt(encryptedHex, key) {
		const encryptedBytes = Aes.utils.hex.toBytes(encryptedHex);
		const aes = new Aes.ModeOfOperation.ctr(key);
		const plainBytes = aes.decrypt(encryptedBytes);
		const plainText = decodeURIComponent(Aes.utils.utf8.fromBytes(plainBytes));
		return plainText;
	}

	static hexEncode(s) {
		let result = "";
		for (let i=0; i<s.length; i++) {
			const hex = s.charCodeAt(i).toString(16);
			result += ("000"+hex).slice(-4);
		}	
		return result;
	}

	static hexDecode(s) {
		const hexes = s.match(/.{1,4}/g) || [];
		let result = "";
		for(let j = 0; j<hexes.length; j++) {
			result += String.fromCharCode(parseInt(hexes[j], 16));
		}
		return result;
	}

}

module.exports = Crypto;
