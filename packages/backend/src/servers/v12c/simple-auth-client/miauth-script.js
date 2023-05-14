
const origin = location.origin;

initPage();

function initPage() {
	// 渡されなかったパラメーターを必要とする要素を消したりする
	if (name_ === '') {
		const appname = document.getElementById('appname');
		appname.parentElement.removeChild(appname);
	}
	if (icon_ === '') {
		console.log(icon_);
		const appicon = document.getElementById('appicon');
		appicon.parentElement.removeChild(appicon);
	}
}

function post() {
	const xhr = new XMLHttpRequest();
	const input = document.getElementById('input');
	const apikey = input.value;
	const permissions__ = permissions_.split(',')

	if (apikey == '') {
		alert('Please input API key.');
		return;
	}

	//必須なものだけで一旦オブジェクト作ってあとから追加してる
	const data = {
		"i": apikey,
		"session": token_,
		"permission": permissions__
	};
	if (name_ !== '') {
		data['name'] = name_;
	}
	if (icon_ !== '') {
		data['icon'] = icon_;
	}
	xhr.onload = function() {
		const res = JSON.parse(xhr.responseText);
		if (xhr.status == 200 || xhr.status == 204) {
			//成功したときのやつ
			if (callback_ !== '') { //callback
				location.href = callback_ + '?session=' + token_;
			}
		}
		else {
			if ( xhr.status == 400 ){ //エラー内容をアラートする
				if (res.error.code !== undefined) {
					alert('Error: ' + res.error.code);
				}
			}
			else if (xhr.status == 403) {
				alert('Error: 403: Access denied.');
			}
		}
	};
	xhr.onerror = function() {
		alert('An error occurred during the transaction. \n ' + xhr.status + ' : ' + xhr.statusText);
	};
	xhr.open('POST', origin + '/api/miauth/gen-token',true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}
