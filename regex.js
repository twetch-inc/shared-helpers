const BITCOIN_FILES_REGEX = /http(s)?:\/\/(.*\.)?media\.bitcoinfiles\.org\/([A-z0-9]+)/;
const MENTION_REGEX = /(@[0-9]+)/g;
const POST_NEWLINE_REGEX = /\n{3,}/g;
const SOUNDCLOUD_REGEX = /http(s)?:\/\/(.*\.)?soundcloud\.com\/[A-z0-9_/?=-]+/;
const TWETCH_POST_REGEX = /http(s)?:\/\/(.*\.)?twetch\.app\/t\/([A-z0-9_/?=]+)/;
const TWETCH_REPLY_REGEX = /http(s)?:\/\/(.*\.)?twetch\.app\/t\/[A-z0-9_/?=]+#([A-z0-9_/?=]+)/;
const TWITTER_REGEX = /http(s)?:\/\/(.*\.)?twitter\.com\/[A-z0-9_/?=]+/;
const VIZ_REGEX = /http(s)?:\/\/(.*\.)?viz\.cash\/v\/([A-z0-9]+)/;
/* eslint-disable */
const YOUTUBE_REGEX = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
/* eslint-enable */
const HASHTAG_REGEX = /(#bitcoin)/gi;
const PAY_REGEX = /\/(pay) @([0-9]+) \$([0-9]+(.[0-9]+)?)/m;
const MULTI_PAY_REGEX = /\/(pay)(( @([0-9]+))+) \$([0-9]+(.[0-9]+)?)/;

module.exports = {
	BITCOIN_FILES_REGEX,
	MENTION_REGEX,
	POST_NEWLINE_REGEX,
	SOUNDCLOUD_REGEX,
	TWETCH_POST_REGEX,
	TWETCH_REPLY_REGEX,
	TWITTER_REGEX,
	VIZ_REGEX,
	YOUTUBE_REGEX,
	HASHTAG_REGEX,
	PAY_REGEX,
	MULTI_PAY_REGEX
};
