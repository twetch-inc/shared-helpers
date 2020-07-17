const PostHelper = require('./post');

test('text/plain description', () => {
	const post = { bContent: 'Hello World', bContentType: 'text/plain' };
	const description = PostHelper.description(post);
	const contentType = PostHelper.contentType(post);
	const isMedia = PostHelper.isMedia(post);
	const isBranch = PostHelper.isBranch(post);
	const isQuote = PostHelper.isQuote(post);
	const type = PostHelper.type(post);

	expect(description).toBe(post.bContent);
	expect(contentType).toBe(post.bContentType);
	expect(isMedia).toBe(false);
	expect(isBranch).toBe(false);
	expect(isQuote).toBe(false);
	expect(type).toBe('post');
});

test('mentions', () => {
	const post = { bContent: 'Hello @1 and @2 and @3', bContentType: 'text/plain' };
	const mentions = PostHelper.mentions(post);
	expect(mentions).toStrictEqual(['1', '2', '3']);
});

test('contentTypes', () => {
	const post = { bContent: 'Hello World', bContentType: 'text/plain' };
	let mediaType = PostHelper.mediaType(PostHelper.contentType(post));
	expect(mediaType).toBe(undefined);

	post.bContentType = 'image/jpg';
	mediaType = PostHelper.mediaType(PostHelper.contentType(post));
	expect(mediaType).toBe('image');

	post.bContentType = 'video/mp4';
	mediaType = PostHelper.mediaType(PostHelper.contentType(post));
	expect(mediaType).toBe('video');

	post.bContentType = 'audio/mp3';
	mediaType = PostHelper.mediaType(PostHelper.contentType(post));
	expect(mediaType).toBe('audio');
});

test('text/plain underscore', () => {
	const post = { b_content: 'Hello World', b_content_type: 'text/plain' };
	const description = PostHelper.description(post, { underscore: true });
	const contentType = PostHelper.contentType(post, { underscore: true });
	const isMedia = PostHelper.isMedia(post, { underscore: true });

	expect(description).toBe(post.b_content);
	expect(contentType).toBe(post.b_content_type);
	expect(isMedia).toBe(false);
});

test('branch', () => {
	const post = {
		bContent:
			'https://twetch.app/t/49b5fb6fcfb8c1365f27281b5fce39df34ce47bfdef6f373ecba47eba2939b1b',
		bContentType: 'text/plain',
	};

	const isBranch = PostHelper.isBranch(post);
	const type = PostHelper.type(post);
	const transaction = PostHelper.branchTransaction(post);

	expect(isBranch).toBe(true);
	expect(type).toBe('branch');
	expect(transaction).toBe('49b5fb6fcfb8c1365f27281b5fce39df34ce47bfdef6f373ecba47eba2939b1b');
});

test('quote', () => {
	const post = {
		bContent:
			'hi https://twetch.app/t/49b5fb6fcfb8c1365f27281b5fce39df34ce47bfdef6f373ecba47eba2939b1b',
		bContentType: 'text/plain',
	};

	const isBranch = PostHelper.isBranch(post);
	const type = PostHelper.type(post);

	expect(isBranch).toBe(false);
	expect(type).toBe('quote');
});

test('media description', () => {
	const post = { bContent: 'imageData', bContentType: 'image/jpeg', mapComment: 'Hello World' };
	const description = PostHelper.description(post);
	expect(description).toBe(post.mapComment);
});

test('/pay command', () => {
	const post = { bContent: 'stuff before /pay @1 $1', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('1');
	expect(payCommand.userIds).toStrictEqual(['1']);
	expect(payCommand.currency).toBe('USD');
});

test('/pay command - BSV', () => {
	const post = { bContent: '/pay @1 100 BSV', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('100');
	expect(payCommand.userIds).toStrictEqual(['1']);
	expect(payCommand.currency).toBe('BSV');
});

test('/pay command - BSV decimal', () => {
	const post = { bContent: '/pay @1 0.01 BSV', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('0.01');
	expect(payCommand.userIds).toStrictEqual(['1']);
	expect(payCommand.currency).toBe('BSV');
});

test('/pay command multi', () => {
	const post = { bContent: '/pay @1 @2 @3 $1', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('1');
	expect(payCommand.userIds).toStrictEqual(['1', '2', '3']);
});

test('/pay command multi', () => {
	const post = {
		bContent: '\n\n yo yo yo /pay @40 deanlittle@moneybutton.com 1deanlittle $harry 1FnZChq5ArfMTMEgGTX8q2nNANMmmZZT1B $1',
		bContentType: 'text/plain',
	};
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('1');
	expect(payCommand.userIds).toStrictEqual(['40']);
	expect(payCommand.paymails).toStrictEqual([
		'deanlittle@moneybutton.com',
		'1deanlittle@relayx.io',
		'harry@handcash.io',
	]);
	expect(payCommand.addresses).toStrictEqual(['1FnZChq5ArfMTMEgGTX8q2nNANMmmZZT1B']);
});

test('/trolltoll command', () => {
	const post = { bContent: '/trolltoll @1 $1.25\n  ', bContentType: 'text/plain' };
	const command = PostHelper.trollTollCommand(post);
	expect(command.command).toBe('trolltoll');
	expect(command.action).toBe('add');
	expect(command.userId).toBe('1');
	expect(command.amount).toBe('1.25');
});

test('/trolltoll remove extra text', () => {
	const post = { bContent: '/trolltoll set @1 $1.25 hello world', bContentType: 'text/plain' };
	const command = PostHelper.trollTollCommand(post);
	const displayDescription = PostHelper.displayDescription(post);
	expect(command.command).toBe('trolltoll');
	expect(command.action).toBe('set');
	expect(command.userId).toBe('1');
	expect(command.amount).toBe('1.25');
	expect(displayDescription).toBe(command.match[0]);
});

test('/trolltoll set command', () => {
	const post = { bContent: '/trolltoll add @1 $1.25\n  ', bContentType: 'text/plain' };
	const command = PostHelper.trollTollCommand(post);
	expect(command.command).toBe('trolltoll');
	expect(command.action).toBe('add');
	expect(command.userId).toBe('1');
	expect(command.amount).toBe('1.25');
});

test('/trolltoll remove command', () => {
	const post = { bContent: '/trolltoLl remove @1', bContentType: 'text/plain' };
	const command = PostHelper.trollTollCommand(post);

	expect(command.command).toBe('trolltoll');
	expect(command.action).toBe('remove');
	expect(command.userId).toBe('1');
	expect(command.amount).toBe(undefined);
});

test('/poll command', () => {
	const post = { bContent: '/poll [1,one,juan]', bContentType: 'text/plain' };
	const command = PostHelper.pollCommand(post);

	expect(command.command).toBe('poll');
	expect(command.choices).toStrictEqual(['1', 'one', 'juan']);
});

test('bitcoinfiles preview', () => {
	const hash = 'ced6ebb54f1b49577b855d117e1ed89473f9cb71341f66daaeee47c9c78ac3e7';
	const post = { bContent: `https://bitcoinfiles.org/t/${hash}`, bContentType: 'text/plain' };
	const entities = PostHelper.entities(post);

	expect(entities.embeds.bitcoinfiles[3]).toBe(hash);
});

test('bitcoinfiles', () => {
	const hash = 'ced6ebb54f1b49577b855d117e1ed89473f9cb71341f66daaeee47c9c78ac3e7';
	const post = { bContent: `https://media.bitcoinfiles.org/${hash}`, bContentType: 'text/plain' };
	const entities = PostHelper.entities(post);

	expect(entities.embeds.bitcoinfiles[3]).toBe(hash);
});
