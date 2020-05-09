const _get = require('lodash/get');
const _uniq = require('lodash/uniq');

const {
	MULTI_PAY_REGEX,
	TWETCH_POST_REGEX,
	TWETCH_REPLY_REGEX,
	MENTION_REGEX,
	TROLL_TOLL_REGEX
} = require('./regex');

class PostHelper {
	static entities(post, options = { underscore: false }) {
		const description = PostHelper.description(post, options);
		const contentType = PostHelper.contentType(post, options);

		return {
			description,
			contentType,
			mediaType: PostHelper.mediaType(contentType),
			isMedia: PostHelper.isMedia(contentType),
			isBranch: PostHelper.isBranch(post, options),
			isQuote: PostHelper.isQuote(post, options),
			type: PostHelper.type(post, options),
			branchTransaction: PostHelper.branchTransaction(description, options),
			mentions: PostHelper.mentions(description, options),
			estimateCost: PostHelper.estimate(post),
			commands: {
				pay: PostHelpers.payCommand(description, options),
				trollToll: PostHelpers.trollTollCommand(description, options)
			}
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

		description = description.replace(TWETCH_REPLY_REGEX, '');
		description = description.replace(TWETCH_POST_REGEX, '');
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

		const match = description.match(TWETCH_POST_REGEX);
		const replyMatch = description.match(TWETCH_REPLY_REGEX);

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

		return _uniq((description.match(MENTION_REGEX) || []).map(e => e.replace('@', '')));
	}

	static payCommand(description, options = {}) {
		if (typeof description === 'object') {
			description = this.description(description, options);
		}

		const match = description.match(MULTI_PAY_REGEX);

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

		const match = description.match(TROLL_TOLL_REGEX);

		if (!match) {
			return;
		}

		if (description.replace(TROLL_TOLL_REGEX, '').trim()) {
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

		const description = PostHelper.description(post);
		const mentions = PostHelper.mentions(description);
		const branchTransaction = PostHelper.branchTransaction(description);
		const payCommand = PostHelper.payCommand(description);

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
