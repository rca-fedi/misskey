
const endpoint = location.origin + '/api/auth/accept';

function post() {
	const input = document.getElementById('input');
	const apikey = input.value;

	const data = {
		"i": apikey,
		"token": token_,
	};	

	const xhr = new XMLHttpRequest();
	xhr.onload = function() {
		// コールバックとか書く
	}
	xhr.onerror = function() {
		// エラー処理とか書く
	}
	xhr.open('POST', endpoint, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}
