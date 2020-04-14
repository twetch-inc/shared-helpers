const Postmate = require('postmate').default;
const SELF_URL = 'https://auth-frontend.twetch.app';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class TwetchAuth {
	async init() {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = `.twetchAuthFrame {
			border: none;
			overflow: hidden;
			width: 100vw;
			height: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
		}`;
		document.getElementsByTagName('head')[0].appendChild(style);
		const urlParams = new URLSearchParams(window.location.search);
		const sessionId = urlParams.get('tncpw_session');
		this.child = await new Postmate({
			container: document.body,
			url: sessionId ? `${SELF_URL}/sign-up?tncpw_session=${sessionId}` : SELF_URL,
			classListArray: ['twetchAuthFrame']
		});
		this.didInit = true;
		console.log('[AUTH PARENT] - did init');
	}

	async token() {
		console.log('[AUTH PARENT] - token()');

		if (!this.didInit) {
			await sleep(200);
			this.token();
			return;
		}

		return new Promise((resolve, reject) => {
			this.child.on('tokenTwetchAuth', ({ token }) => {
				return resolve(token);
			});
		});
	}
}

const twetchAuth = new TwetchAuth();
module.exports = twetchAuth;
