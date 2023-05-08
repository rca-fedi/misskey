
const api = location.origin + '/api/miauth/gen-token';

function post() {
	const xhr = new XMLHttpRequest();
	const input = document.getElementById('input');
	const apikey = input.value;
	const permissions__ = permissions.split(',')
	const data = {
		"i": apikey,
		"session": token,
		"name": "hoge(HARD)", //TODO: ハードコーディングやめる
		"permission": permissions__,
	};
	//DEBUG
	console.log(data);
	console.log(JSON.stringify(data));
	console.log(api);
	xhr.onload = function() {
		console.log(xhr.responseText);
	};
	xhr.onerror = function() {
		// エラー処理する
	};
	xhr.open('POST', api,true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}
