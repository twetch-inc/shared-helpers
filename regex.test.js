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

	it('match youtube', () => {
		const match = regex.match(`https://www.youtube.com/watch?v=IpmHQWfhVsY`, 'YOUTUBE_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('match hash/cash tags', () => {
		// In order - No hashtag, Chinese, Hindi, Spanish, French, Russian, German, Japanese, Marathi, Telegu, Punjabi, Tamil, Turkish, Vietnamese, English, English
		const match = regex.match(`
			Hello World!
			#圣诞节快乐
			$क्रिसमसकीबधाई
			$café
			$bonneaprèsmidi
			#Добрыйдень
			$Straße
			$こんにちは
			$शुभदुपार
			#శుభమద్యాహ్నం
			$ਸਤਸ੍ਰੀਅਕਾਲ
			$மதியவணக்கம்
			#Tünaydın,
			$tiếngchào
			#test
			$21e8`, 
		'HASHTAG_REGEX');
		console.log({ match }, match.length);
		expect(!!match).toBe(true);
	});
});
