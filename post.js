const _ = require('lodash');
const {
	MULTI_PAY_REGEX,
	TWETCH_POST_REGEX,
	TWETCH_REPLY_REGEX,
	MENTION_REGEX,
	TROLL_TOLL_REGEX
} = require('./regex');

class PostHelper {
	static description(post, options = { underscore: false }) {
		let mapComment = _.get(post, 'mapComment');
		let bContent = _.get(post, 'bContent');
		let contentType = _.get(post, 'bContentType', '');

		if (options.underscore) {
			contentType = _.get(post, 'b_content_type', '');
			mapComment = _.get(post, 'map_comment');
			bContent = _.get(post, 'b_content');
		}

		const description = this.isMedia(contentType) ? mapComment : bContent;

		return description || '';
	}

	static contentType(post, options = {}) {
		let contentType = _.get(post, 'bContentType', '');

		if (options.underscore) {
			contentType = _.get(post, 'b_content_type', '');
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

		return _.uniq((description.match(MENTION_REGEX) || []).map(e => e.replace('@', '')));
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

		const [r, command, action, userId, x, amount] = match;
		return { command: command.toLowerCase(), action, userId, amount };
	}
}

module.exports = PostHelper;
