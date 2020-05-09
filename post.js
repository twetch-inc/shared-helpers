const _get = require('lodash/get');
const _uniq = require('lodash/uniq');
const regex = require('./regex');

class PostHelper {
	static entities(post, options = { underscore: false }) {
		const description = this.description(post, options);
		const contentType = this.contentType(post, options);
		const displayDescription = this.displayDescription(post);
		const descriptionParts = displayDescription.split('\n');

		return {
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
			embeds: {
				soundcloud: description.match(regex.SOUNDCLOUD_REGEX),
				viz: description.match(regex.VIZ_REGEX),
				youtube: description.match(regex.YOUTUBE_REGEX),
				bitcoinfiles: description.match(regex.BITCOIN_FILES_REGEX),
			},
			elements: descriptionParts
				.filter((e, i) => e || descriptionParts[i + 1])
				.map((v) =>
					v
						.split(regex.MENTION_REGEX)
						.reduce((a, e) => a.concat(e.split(regex.HASHTAG_REGEX)), [])
						.filter((e) => e)
						.map((e) => {
							if (e.startsWith('#') && e.match(regex.HASHTAG_REGEX)) {
								return { type: 'hashtag', value: `${e} 🐉` };
							}

							if (e.startsWith('@') && !isNaN(parseInt(e.replace('@', ''), 10))) {
								return { type: 'mention', value: e, userId: e.replace('@', '') };
							}

							return { type: 'text', value: e };
						})
				),
			commands: {
				pay: this.payCommand(description, options),
				trollToll: this.trollTollCommand(description, options),
			},
		};
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

		if (!description) {
			return;
		}

		description = description.replace(regex.BITCOIN_FILES_REGEX, '');
		description = description.replace(regex.TWETCH_REPLY_REGEX, '');
		description = description.replace(regex.TWETCH_POST_REGEX, '');
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

		description = description.replace(regex.WETCH_REPLY_REGEX, '');
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

		return _uniq((description.match(regex.MENTION_REGEX) || []).map((e) => e.replace('@', '')));
	}

	static payCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		const match = description.match(regex.MULTI_PAY_REGEX);

		if (!match) {
			return;
		}

		const [r, command, mentions, x, y, amount] = match;
		return { command, userIds: this.mentions(mentions), amount };
	}

	static trollTollCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		const match = description.match(regex.TROLL_TOLL_REGEX);

		if (!match) {
			return;
		}

		if (description.replace(regex.TROLL_TOLL_REGEX, '').trim()) {
			return;
		}

		const [r, command, action, userId, x, amount] = match;
		return { command: command.toLowerCase(), action, userId, amount };
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
			value += parseFloat(payCommand.amount);
		}

		return value;
	}
}

module.exports = PostHelper;
