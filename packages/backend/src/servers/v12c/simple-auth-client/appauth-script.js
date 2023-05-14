
const origin = location.origin;
let callback = null;

fetchMeta();

function fetchMeta() {
	const url = origin + '/api/auth/session/show';

	const data_meta = {
		"token": token_,
	}

	xhr = new XMLHttpRequest();
	xhr.onload = function() {
		console.log(xhr.responseText);
		const res = JSON.parse(xhr.responseText);
		callback = res.app.callbackUrl;
	}
	xhr.onerror = function() {
		// エラー処理する
	}
	xhr.open('POST', origin + '/api/auth/session/show', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data_meta));

}


function post() {
	const input = document.getElementById('input');
	const apikey = input.value;

	const data_accept = {
		"i": apikey,
		"token": token_,
	};	

	const xhr = new XMLHttpRequest();
	xhr.onload = function() {
		// console.log(xhr.responseText);
		// const res = JSON.parse(xhr.responseText);
		console.log(xhr.status)
		if (xhr.status == 204) {
			console.log('success');
			location.href = callback + '?token=' + token_;
		}
	}
	xhr.onerror = function() {
		// エラー処理とか書く
	}
	xhr.open('POST', origin + '/api/auth/accept', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data_accept));
}
