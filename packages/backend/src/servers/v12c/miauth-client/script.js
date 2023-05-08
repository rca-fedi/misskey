const { isArrayTypeNode } = require("typescript");

const api = location.origin + '/api/miauth/gen-token';

function post() {
	const xhr = new XMLHttpRequest();
	const input = document.getElementById('input');
	const apikey = input.value;
	const permissions__ = permissions_.split(',')
	const data = {
		"i": apikey,
		"session": token_,
		"name": name_,
		"permission": permissions__, //TODO: 条件分岐して存在する値だけ送るようにする
		// "iconUrl": icon_,
	};
	//DEBUG
	console.log(data);
	console.log(JSON.stringify(data));
	console.log(api);
	xhr.onload = function() {
		console.log(xhr.responseText); //debug
		if (callback_ !== null) {
			resp = JSON.parse(xhr.responseText);
			console.log(callback_ + '?token=' + resp.token);
			location.href = callback_ + '?token=' + resp.token;
		}
	};
	xhr.onerror = function() {
		alert('An error occurred during the transaction. \n ' + xhr.status + ' : ' + xhr.statusText);
	};
	xhr.open('POST', api,true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}
