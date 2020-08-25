const BITCOIN_FILES_REGEX = /http(s)?:\/\/(.*\.)?media\.bitcoinfiles\.org\/([A-z0-9]+)/;
const BITCOIN_FILES_PREVIEW_REGEX = /http(s)?:\/\/(.*\.)?bitcoinfiles\.org\/t\/([A-z0-9_\/?=]+)/;
const HASHTAG_REGEX = /(#bitcoin)/gi;
const MENTION_REGEX = /(@[0-9]+)/g;
const MULTI_PAY_REGEX = /\/(pay)(( @([0-9]+))+) \$([0-9]+(.[0-9]+)?)/;
const MULTI_PAY_BSV_REGEX = /\/(pay)(( @([0-9]+))+) ([0-9]+(.[0-9]+)?)(\ ?)(bsv|BSV)/;
const MULTIPLE_SPACES_REGEX = /[^\S\r\n]+/g;
const PAY_REGEX = /\/(pay) @([0-9]+) \$([0-9]+(.[0-9]+)?)/m;
const POST_NEWLINE_REGEX = /\n{3,}/g;
const POLL_REGEX = /\/(poll) \[(.*?)\]/;
const SOUNDCLOUD_REGEX = /http(s)?:\/\/(.*\.)?soundcloud\.com\/[A-z0-9_/?=-]+/;
const STREAMANITY_REGEX = /http(s)?:\/\/(.*\.)?streamanity\.com\/video\/([A-z0-9]+(\?ref=([A-z0-9-])+)?)/;
const TROLL_TOLL_REGEX = /\/(trolltoll) (set|add|remove) @([0-9]+)( \$([0-9]+(.[0-9]+)?))?/im;
const TROLL_TOLL_DEFAULT_REGEX = /\/(trolltoll) @([0-9]+)( \$([0-9]+(.[0-9]+)?))?/im;
const TWETCH_POST_REGEX = /http(s)?:\/\/(.*\.)?twetch\.app\/t\/([A-z0-9_/?=]+)/;
const TWETCH_REPLY_REGEX = /http(s)?:\/\/(.*\.)?twetch\.app\/t\/[A-z0-9_/?=]+#([A-z0-9_/?=]+)/;
const TWITTER_REGEX = /http(s)?:\/\/(.*\.)?twitter\.com\/[A-z0-9_/?=]+/;
const VIZ_REGEX = /http(s)?:\/\/(.*\.)?viz\.cash\/v\/([A-z0-9]+)/;
//PAY_TO_ANY
const PAY_ANY = /(\/[pP][aA][yY])\s+((\@\d+\s+)|([a-zA-Z\-\_\d]+@[a-zA-Z\-\_\d\.]+[a-zA-Z\d]\s+)|([1][a-km-zA-HJ-NP-Z\d]{25,34}\s+)|([$][a-zA-Z\d-_.]{4,50}\s+)|([1][a-zA-Z\d]+\s+))+(((((\d{1,8})?(\.\d{1,8}))|((\d{1,8})(\.\d{1,8})?))\s*([bB][sS][vV]))|([$][\d]+(\.[\d]+)?))/g;
const PAY_ANY_PAYMAIL = /^[a-zA-Z\-\_\d]+@[a-zA-Z\-\_\d\.]+[a-zA-Z\d]/;
const PAY_ANY_RELAY_HANDLE = /^[1][a-z0-9]+/i;
const PAY_ANY_HANDCASH_HANDLE = /^[$][a-zA-Z\d-_.]{4,50}/;
const PAY_ANY_P2PKH = /^[1][a-km-zA-HJ-NP-Z\d]{25,34}/;
const PAY_ANY_ADDRESSES = /((\@\d+\s+)|([a-zA-Z\-\_\d]+@[a-zA-Z\-\_\d\.]+[a-zA-Z\d]\s+)|([1][a-km-zA-HJ-NP-Z\d]{25,34}\s+)|([$][a-zA-Z\d-_.]{4,50}\s+)|([1][a-zA-Z\d]+\s+))/g;
const PAY_ANY_CURRENCY = /((((\d{1,8})?\.\d{1,8})|(\d{1,8}(\.\d{1,8})?))\s*[bB][sS][vV])|([$][\d]*(\.[\d]+)?)/g;
const PAY_ANY_CURRENCY_BSV = /(((\d{1,8})?\.\d{1,8})|(\d{1,8}(\.\d{1,8})?))\s*[bB][sS][vV]/g;
const PAY_ANY_CURRENCY_USD = /([$][\d]*(\.[\d]+)?)/g;
/* eslint-disable */
const YOUTUBE_REGEX = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(?<videoID>[^#&?]*)(?:.*(?>t=(?<start>[0-9]+)).*$)?/;
/* eslint-enable */

const match = (value, option) => {
	const regex = options[option];
	return value.match(regex);
};

const options = {
	BITCOIN_FILES_REGEX,
	BITCOIN_FILES_PREVIEW_REGEX,
	HASHTAG_REGEX,
	MENTION_REGEX,
	MULTI_PAY_REGEX,
	MULTI_PAY_BSV_REGEX,
	MULTIPLE_SPACES_REGEX,
	PAY_REGEX,
	PAY_ANY,
	PAY_ANY_PAYMAIL,
	PAY_ANY_RELAY_HANDLE,
	PAY_ANY_HANDCASH_HANDLE,
	PAY_ANY_P2PKH,
	PAY_ANY_ADDRESSES,
	PAY_ANY_CURRENCY,
	PAY_ANY_CURRENCY_BSV,
	PAY_ANY_CURRENCY_USD,
	POST_NEWLINE_REGEX,
	POLL_REGEX,
	SOUNDCLOUD_REGEX,
	STREAMANITY_REGEX,
	TROLL_TOLL_REGEX,
	TROLL_TOLL_DEFAULT_REGEX,
	TWETCH_POST_REGEX,
	TWETCH_REPLY_REGEX,
	TWITTER_REGEX,
	VIZ_REGEX,
	YOUTUBE_REGEX,
};

module.exports = {
	...options,
	match,
};
