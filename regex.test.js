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
	it('Chinese', () => {
		const match = regex.match(`#圣诞节快乐`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Hindi', () => {
		const match = regex.match(`$क्रिसमसकीबधाई`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Spanish', () => {
		const match = regex.match(`$café`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('French', () => {
		const match = regex.match(`$bonneaprèsmidi`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Russian', () => {
		const match = regex.match(`#Добрыйдень`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('German', () => {
		const match = regex.match(`$Straße`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Japanese', () => {
		const match = regex.match(`$こんにちは`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Marathi', () => {
		const match = regex.match(`$शुभदुपार`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Telegu', () => {
		const match = regex.match(`#శుభమద్యాహ్నం`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Punjabi', () => {
		const match = regex.match(`$ਸਤਸ੍ਰੀਅਕਾਲ`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Tamil', () => {
		const match = regex.match(`$மதியவணக்கம்`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Turkish', () => {
		const match = regex.match(`#Tünaydın`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Vietnamese', () => {
		const match = regex.match(`$tiếngchào`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('Korean', () => {
		const match = regex.match(`#좋은아침`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('English', () => {
		const match = regex.match(`$21e8`,'HASHTAG_REGEX');
		console.log({ match });
		expect(!!match).toBe(true);
	});
	it('dollarAmount', () => {
		const value = '#_,.';
		const match = regex.match(value,'HASHTAG_REGEX');
		console.log({ match });
		expect(match[0]).toBe(value);
	});
	it('pennyAmount', () => {
		const value = `$.218`
		const match = regex.match(value,'HASHTAG_REGEX');
		console.log({ match });
		expect(match[0]).toBe(value);
	});
});
