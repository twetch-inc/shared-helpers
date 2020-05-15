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
	const post = { bContent: '/pay @1 $1', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('1');
	expect(payCommand.userIds).toStrictEqual(['1']);
});

test('/pay command multi', () => {
	const post = { bContent: '/pay @1 @2 @3 $1', bContentType: 'text/plain' };
	const payCommand = PostHelper.payCommand(post);

	expect(payCommand.command).toBe('pay');
	expect(payCommand.amount).toBe('1');
	expect(payCommand.userIds).toStrictEqual(['1', '2', '3']);
});

test('/trolltoll fake command', () => {
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
	const post = { bContent: '/trolltoll set @1 $1.25\n  ', bContentType: 'text/plain' };
	const command = PostHelper.trollTollCommand(post);
	expect(command.command).toBe('trolltoll');
	expect(command.action).toBe('set');
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

test('entities', () => {
	const post = {
		bContent:
			'/pay @1 $1 \n #bitcoin https://twetch.app/t/ef1ae682c36b0f17ea9f83648a3dca39138d2b8661c28dec221d1170fb185128 https://media.bitcoinfiles.org/3b4dc31bf9d7f2b6f5cf5fdad5178e53bf4fb10d74be4143f7ba72dbba07c34c https://www.youtube.com/watch?v=kWI3uWl32y8&t=1s',
		bContentType: 'text/plain',
	};
	const entities = PostHelper.entities(post);
	expect(entities).toMatchInlineSnapshot(`
		Object {
		  "branchTransaction": "ef1ae682c36b0f17ea9f83648a3dca39138d2b8661c28dec221d1170fb185128",
		  "commands": Object {
		    "pay": Object {
		      "amount": "1",
		      "command": "pay",
		      "match": Array [
		        "/pay @1 $1",
		        "pay",
		        " @1",
		        " @1",
		        "1",
		        "1",
		        undefined,
		      ],
		      "userIds": Array [
		        "1",
		      ],
		    },
		    "trollToll": undefined,
		  },
		  "contentType": "text/plain",
		  "description": "/pay @1 $1 
		 #bitcoin https://twetch.app/t/ef1ae682c36b0f17ea9f83648a3dca39138d2b8661c28dec221d1170fb185128 https://media.bitcoinfiles.org/3b4dc31bf9d7f2b6f5cf5fdad5178e53bf4fb10d74be4143f7ba72dbba07c34c https://www.youtube.com/watch?v=kWI3uWl32y8&t=1s",
		  "displayDescription": "/pay @1 $1 
		 #bitcoin   https://www.youtube.com/watch?v=kWI3uWl32y8&t=1s",
		  "elements": Array [
		    Array [
		      Object {
		        "type": "text",
		        "value": "/pay ",
		      },
		      Object {
		        "type": "mention",
		        "userId": "1",
		        "value": "@1",
		      },
		      Object {
		        "type": "text",
		        "value": " $1 ",
		      },
		    ],
		    Array [
		      Object {
		        "type": "text",
		        "value": " ",
		      },
		      Object {
		        "type": "hashtag",
		        "value": "#bitcoin 🐉",
		      },
		      Object {
		        "type": "text",
		        "value": "   https://www.youtube.com/watch?v=kWI3uWl32y8&t=1s",
		      },
		    ],
		  ],
		  "embeds": Object {
		    "bitcoinfiles": Array [
		      "https://media.bitcoinfiles.org/3b4dc31bf9d7f2b6f5cf5fdad5178e53bf4fb10d74be4143f7ba72dbba07c34c",
		      "s",
		      undefined,
		      "3b4dc31bf9d7f2b6f5cf5fdad5178e53bf4fb10d74be4143f7ba72dbba07c34c",
		    ],
		    "soundcloud": null,
		    "viz": null,
		    "youtube": Array [
		      "https://www.youtube.com/watch?v=kWI3uWl32y8",
		      "kWI3uWl32y8",
		      undefined,
		      undefined,
		    ],
		  },
		  "estimateCost": 1.035,
		  "isBranch": false,
		  "isMedia": false,
		  "isQuote": true,
		  "mediaType": undefined,
		  "mentions": Array [
		    "1",
		  ],
		  "type": "quote",
		}
	`);
});
