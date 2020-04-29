const { TWITTER_REGEX, TWETCH_POST_REGEX, TWETCH_REPLY_REGEX } = require('./regex');

function isHash(str) {
	var hash = new RegExp('^[a-fA-F0-9]{'.concat(64, '}$'));
	return hash.test(str);
}

class PostValidator {
	constructor({ description, transaction, contentType }) {
		this.description = description;
		this.transaction = transaction;
		this.contentType = contentType;
	}

	validate() {
		const validations = [
			this.validateDescription(),
			this.validateTransaction(),
			this.validateContentType()
		];

		const valid = !validations.some(e => !e.valid);
		const errors = validations.filter(e => e.error).map(e => e.error);

		return { valid, errors };
	}

	validateDescription() {
		const descriptionLength = this.descriptionLength();
		if (descriptionLength > 256) {
			return {
				valid: false,
				error: 'description must be less than 256 characters'
			};
		}

		return { valid: true };
	}

	validateTransaction() {
		if (!this.transaction) {
			return { valid: false, error: 'transaction must have a value' };
		}

		if (!isHash(this.transaction, 'sha256')) {
			return { valid: false, error: 'transaction must be a sha256 hash' };
		}

		return { valid: true };
	}

	validateContentType() {
		if (!this.contentType) {
			return { valid: false, error: 'contentType must have a value' };
		}

		if (
			!(
				/^image\//g.test(this.contentType) ||
				/^video\//g.test(this.contentType) ||
				/^audio\//g.test(this.contentType) ||
				/^text\//g.test(this.contentType)
			)
		) {
			return {
				valid: false,
				error: `contentType '${this.contentType}' is not valid`
			};
		}

		return { valid: true };
	}

	descriptionLength() {
		if (!this.description || !this.description) {
			return 0;
		}

		return this.description
			.replace(TWITTER_REGEX, '')
			.replace(TWETCH_POST_REGEX, '')
			.replace(TWETCH_REPLY_REGEX, '').length;
	}
}

module.exports = PostValidator;
