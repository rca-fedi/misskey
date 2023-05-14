
const origin = location.origin;
let callback = null;

fetchMeta();

function fetchMeta() {
	const data_meta = {
		"token": token_,
	}

	xhr = new XMLHttpRequest();
	xhr.onload = function() {
		// console.log(xhr.responseText);
		const res = JSON.parse(xhr.responseText);
		callback = res.app.callbackUrl;
		updateAppInfo(res);
	}
	xhr.onerror = function() {
		alert('Error: ' + xhr.status)
	}
	xhr.open('POST', origin + '/api/auth/session/show', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data_meta));

}

function updateAppInfo(res) {
	const appnameid = document.getElementById('appnameid');

	appnameid.innerText = res.app.name + ' (' + res.app.id + ')';
}

function post() {
	const input = document.getElementById('input');
	const apikey = input.value;

	if (apikey == '') {
		alert('Please input API key.');
		return;
	}

	const data_accept = {
		"i": apikey,
		"token": token_,
	};	

	const xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (xhr.status == 204) {
			location.href = callback + '?token=' + token_;
		}
	}
	xhr.onerror = function() {
		alert('Error: ' + xhr.status)
	}
	xhr.open('POST', origin + '/api/auth/accept', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data_accept));
}
