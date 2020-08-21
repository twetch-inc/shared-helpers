const _get = require('lodash/get');
const _uniq = require('lodash/uniq');
const regex = require('./regex');
const exchangeRate = require('./exchange-rate');
const LinkifyIt = require('linkify-it');
const tlds = require('tlds');

const linkify = new LinkifyIt();
linkify.tlds(tlds);

class PostHelper {
	static entities(post, options = { underscore: false }) {
		try {
			const description = this.description(post, options);
			const contentType = this.contentType(post, options);
			const displayDescription = this.displayDescription(post);

			return {
				...post,
				branchTransaction: this.branchTransaction(description, options),
				contentType,
				description,
				displayDescription,
				estimateCost: this.estimate(post),
				isBranch: this.isBranch(post, options),
				isMedia: this.isMedia(contentType),
				isQuote: this.isQuote(post, options),
				mediaType: this.mediaType(contentType),
				mentions: this.mentions(description, options),
				type: this.type(post, options),
				files: this.files(post, options),
				embeds: {
					urls: linkify.match(displayDescription),
					soundcloud: description.match(regex.SOUNDCLOUD_REGEX),
					viz: description.match(regex.VIZ_REGEX),
					youtube: description.match(regex.YOUTUBE_REGEX),
					bitcoinfiles:
						description.match(regex.BITCOIN_FILES_REGEX) ||
						description.match(regex.BITCOIN_FILES_PREVIEW_REGEX),
					streamanity: description.match(regex.STREAMANITY_REGEX)
				},
				elements: this.elements(displayDescription),
				commands: {
					pay: this.payCommand(description, options),
					poll: this.pollCommand(description, options),
					trollToll: this.trollTollCommand(description, options)
				}
			};
		} catch (e) {
			console.log(e);
		}
	}

	static files(post) {
		if (!post.files) {
			return [];
		}

		if (typeof post.files === 'string') {
			return JSON.parse(post.files);
		}
	}

	static elements(description) {
		const descriptionParts = description.split('\n');

		return descriptionParts
			.filter((e, i) => e || descriptionParts[i + 1])
			.map(v =>
				v
					.split(regex.MENTION_REGEX)
					.reduce((a, e) => a.concat(e.split(regex.HASHTAG_REGEX)), [])
					.filter(e => e)
					.map(e => {
						if (e.startsWith('#') && e.match(regex.HASHTAG_REGEX)) {
							return { type: 'hashtag', value: `${e} 🐉` };
						}

						if (e.startsWith('@') && !isNaN(parseInt(e.replace('@', ''), 10))) {
							return { type: 'mention', value: e, userId: e.replace('@', '') };
						}

						return { type: 'text', value: e };
					})
			);
	}

	static description(post, options = { underscore: false }) {
		let mapComment = _get(post, 'mapComment');
		let bContent = _get(post, 'bContent');
		let contentType = _get(post, 'bContentType', '');

		if (options.underscore) {
			contentType = _get(post, 'b_content_type', '');
			mapComment = _get(post, 'map_comment');
			bContent = _get(post, 'b_content');
		}

		const description = this.isMedia(contentType) ? mapComment : bContent;

		return description || '';
	}

	static displayDescription(post, options = {}) {
		let description = this.description(post);
		const isMedia = this.isMedia(post);

		if (!description) {
			return '';
		}

		const trollTollCommand = this.trollTollCommand(description);

		if (trollTollCommand) {
			description = trollTollCommand.match[0];
		}

		description = description.replace(regex.BITCOIN_FILES_REGEX, '');
		description = description.replace(regex.BITCOIN_FILES_PREVIEW_REGEX, '');
		description = description.replace(regex.TWETCH_REPLY_REGEX, '');
		description = description.replace(regex.TWETCH_POST_REGEX, '');
		description = description.replace(regex.POLL_REGEX, '');
		description = description.replace(regex.POST_NEWLINE_REGREX, '\n\n');

		description = description.trim();

		return description;
	}

	static contentType(post, options = {}) {
		let contentType = _get(post, 'bContentType', '');

		if (options.underscore) {
			contentType = _get(post, 'b_content_type', '');
		}

		return contentType;
	}

	static isMedia(contentType) {
		if (typeof contentType === 'object') {
			contentType = this.contentType(contentType);
		}

		return (
			/^image\//g.test(contentType) ||
			/^video\//g.test(contentType) ||
			/^audio\//g.test(contentType)
		);
	}

	static mediaType(contentType) {
		if (!this.isMedia(contentType)) {
			return;
		}

		if (/^image\//g.test(contentType)) {
			return 'image';
		}

		if (/^video\//g.test(contentType)) {
			return 'video';
		}

		if (/^audio\//g.test(contentType)) {
			return 'audio';
		}
	}

	static isBranch(post, options = {}) {
		let description = this.description(post, options);
		const branchTransaction = this.branchTransaction(description);

		if (!branchTransaction) {
			return false;
		}

		description = description.replace(regex.TWETCH_REPLY_REGEX, '');
		description = description.replace(regex.TWETCH_POST_REGEX, '');
		description = description.trim();

		return !description.length && !this.isMedia(post, options) && !post.replyPostId;
	}

	static isQuote(post, options = {}) {
		const isBranch = this.isBranch(post, options);

		if (isBranch) {
			return false;
		}

		return !!this.branchTransaction(post, options);
	}

	static type(post, options = {}) {
		if (this.isBranch(post, options)) {
			return 'branch';
		}

		if (this.isQuote(post, options)) {
			return 'quote';
		}

		return 'post';
	}

	static branchTransaction(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		if (!description) {
			description = '';
		}

		const match = description.match(regex.TWETCH_POST_REGEX);
		const replyMatch = description.match(regex.TWETCH_REPLY_REGEX);

		if (!match && !replyMatch) {
			return;
		}

		let transaction = '';

		if (replyMatch) {
			transaction = replyMatch[3];
		} else {
			transaction = match[3];
		}

		return transaction;
	}

	static mentions(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		return _uniq((description.match(regex.MENTION_REGEX) || []).map(e => e.replace('@', '')));
	}

	static payCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		let match = description.match(regex.PAY_ANY);
		if (!match) {
			return;
		}

		//Remove /pay from string
		let m = match[0].replace('/pay', '').trim();
		//Get index of last currency to avoid HandCash handle clash
		const i = [...this.matchAll(regex.PAY_ANY_CURRENCY, m)].pop().index;
		//Get currency string
		let payment = m.substring(i);
		//Get payees
		const payees = m
			.substring(0, i)
			.trim()
			.split(' ');
		//Set currency
		let { currency, amount } = this.getAmount(payment);

		//Define payOut object
		let userIds = [];
		let addresses = [];
		let paymails = [];

		//Set payees
		payees.map(p => {
			if (p.match(regex.MENTION_REGEX)) {
				userIds.push(p.substring(1));
			} else if (p.match(regex.PAY_ANY_P2PKH)) {
				addresses.push(p);
			} else if (p.match(regex.PAY_ANY_PAYMAIL)) {
				paymails.push(p);
			} else if (p.match(regex.PAY_ANY_HANDCASH_HANDLE)) {
				paymails.push(p.substring(1) + '@handcash.io');
			} else if (p.match(regex.PAY_ANY_RELAY_HANDLE)) {
				paymails.push(p + '@relayx.io');
			} else {
				return;
			}
		});
		return { command: 'pay', userIds, paymails, addresses, amount, match, currency };
	}

	static getAmount(s) {
		let currency, amount;
		if (s.match(regex.PAY_ANY_CURRENCY_BSV)) {
			currency = 'BSV';
			amount = s.replace(/bsv/i, '').trim();
		} else if (s.match(regex.PAY_ANY_CURRENCY_USD)) {
			currency = 'USD';
			amount = s.replace('$', '').trim();
		} else {
			throw new Error('Invalid currency or amount');
		}
		if (1 * amount <= 0) {
			return;
		}
		return { currency, amount };
	}

	static matchAll(r, s) {
		let matches = [];
		let match;
		while ((match = r.exec(s)) !== null) {
			matches.push(match);
		}
		return matches;
	}

	static trollTollCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		let match = description.match(regex.TROLL_TOLL_REGEX);

		if (match) {
			const [r, command, action, userId, x, amount] = match;
			return { command: command.toLowerCase(), action, userId, amount, match };
		}

		match = description.match(regex.TROLL_TOLL_DEFAULT_REGEX);

		if (match) {
			const [r, command, userId, x, amount] = match;
			return { command: command.toLowerCase(), action: 'add', userId, amount, match };
		}
	}

	static pollCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		const match = description.match(regex.POLL_REGEX);

		if (!match) {
			return;
		}

		const [r, command, choices] = match;

		return {
			choices: choices
				.split(',')
				.map(e => e.trim())
				.filter(e => e)
				.slice(0, 5),
			command: command.toLowerCase()
		};
	}

	static estimate(post) {
		let value = 0.02;

		if (post.replyPostId) {
			value += 0.01;
		}

		const description = this.description(post);
		const mentions = this.mentions(description);
		const branchTransaction = this.branchTransaction(description);
		const payCommand = this.payCommand(description);

		value += mentions.length * 0.005;

		if (branchTransaction) {
			value += 0.01;
		}

		if (payCommand) {
			if (payCommand.currency === 'USD') {
				value += parseFloat(payCommand.amount);
			}

			if (payCommand.currency === 'BSV') {
				value += parseFloat(payCommand.amount * exchangeRate.price);
			}
		}

		return value;
	}
}

module.exports = PostHelper;
