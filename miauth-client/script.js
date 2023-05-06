let params = url.searchParams;

console.log(params);
let _permissions = params.get('permission');
let _callback = params.get('callback');
let _icon = params.get('icon');
let _name = params.get('name');

let permission_list = document.getElementById('permission-list');

for (let permission of _permissions.split(',')) {
		let li = document.createElement('li');
		li.innerText = permission;
		permission_list.appendChild(li);
}
