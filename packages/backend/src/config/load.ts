// yoiyami config loader

import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as yaml from 'js-yaml';
import { Source, Mixin } from './types.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const dir = `${_dirname}/../../../../.config`;

// productionの場合はproduction.ymlを読み込むようにした（Productionモードの時だけ別のConfigを読み込みたいことがあったので）
const path = process.env.NODE_ENV === 'production'
	? `${dir}/production.yml`
	: process.env.NODE_ENV === 'test'
		? `${dir}/test.yml`
		: `${dir}/default.yml`;

export default function load() {
	const meta = JSON.parse(fs.readFileSync(`${_dirname}/../../../../built/meta.json`, 'utf-8'));
	const clientManifest = JSON.parse(fs.readFileSync(`${_dirname}/../../../../built/_client_dist_/manifest.json`, 'utf-8'));
	const config = yaml.load(fs.readFileSync(path, 'utf-8')) as Source; //暫定

	const mixin = {} as Mixin; //暫定

	const main_url = tryCreateUrl(config.main.url);
	const v12c_url = tryCreateUrl(config.v12c.url);

	config.main.url = main_url.origin;
	config.v12c.url = v12c_url.origin;

	mixin.softwareName = 'yoiyami';
	mixin.version = meta.version;
	mixin.based_version = '12.119.2'; // あとでいいかんじにする必要がある
	mixin.userAgent = `yoiyami/${meta.version} (${config.main.url})`;
	mixin.clientEntry = clientManifest['src/init.ts'];
	// Main
	mixin.main_host = main_url.host;
	mixin.main_hostname = main_url.hostname;
	mixin.main_scheme = main_url.protocol.replace(/:$/, '');
	mixin.main_wsScheme = mixin.main_scheme.replace('http', 'ws');
	mixin.main_wsUrl = `${mixin.main_wsScheme}://${mixin.main_host}`;
	mixin.main_apiUrl = `${mixin.main_scheme}://${mixin.main_host}/api`;
	mixin.main_authUrl = `${mixin.main_scheme}://${mixin.main_host}/auth`;
	mixin.main_driveUrl = `${mixin.main_scheme}://${mixin.main_host}/files`;
	// v12 compatible
	mixin.v12c_host = v12c_url.host;
	mixin.v12c_hostname = v12c_url.hostname;
	mixin.v12c_scheme = v12c_url.protocol.replace(/:$/, '');
	mixin.v12c_wsScheme = mixin.v12c_scheme.replace('http', 'ws');
	mixin.v12c_wsUrl = `${mixin.v12c_wsScheme}://${mixin.v12c_host}`;
	mixin.v12c_apiUrl = `${mixin.v12c_scheme}://${mixin.v12c_host}/api`;
	mixin.v12c_authUrl = `${mixin.v12c_scheme}://${mixin.v12c_host}/auth`;
	mixin.v12c_driveUrl = `${mixin.v12c_scheme}://${mixin.v12c_host}/files`;

	return Object.assign(config, mixin);
}

function tryCreateUrl(url: string) {
	try {
		return new URL(url);
	} catch (e) {
		throw `url="${url}" is not a valid URL.`;
	}
}
