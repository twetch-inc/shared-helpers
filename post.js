const _ = require('lodash');
const { TWETCH_POST_REGEX, TWETCH_REPLY_REGEX, MENTION_REGEX } = require('./regex');

class PostHelper {
	static fromMedia(media) {
		const replyTransaction =
			media.indexOf('reply') !== -1 ? media[media.indexOf('reply') + 1] : null;

		return {
			bContent: media[1],
			bContentType: media[2],
			mapComment: media[13],
			moneyButtonUserId: media[media.indexOf('mb_user') + 1],
			replyTransaction
		};
	}

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
}

module.exports = PostHelper;
