/**
 * Core Server
 */

import cluster from 'node:cluster';
import * as fs from 'node:fs';
import * as http from 'node:http';
import Koa from 'koa';
import Router from '@koa/router';
import mount from 'koa-mount';
import koaLogger from 'koa-logger';
import * as slow from 'koa-slow';

import { IsNull } from 'typeorm';
import config from '@/config/index.js';
import Logger from '@/services/logger.js';
import { UserProfiles, Users } from '@/models/index.js';
import { genIdenticon } from '@/misc/gen-identicon.js';
import { createTemp } from '@/misc/create-temp.js';
import { publishMainStream } from '@/services/stream.js';
import * as Acct from '@/misc/acct.js';
import { envOption } from '../env.js';
import activityPub from './activitypub.js';
import nodeinfo from './nodeinfo.js';
import wellKnown from './well-known.js';
import apiServer_yy from './apis/api-yy/index.js';
import apiServer_mkv12 from './apis/api-mkv12/index.js'
import fileServer from './file/index.js';
import proxyServer from './proxy/index.js';
import webServer from './web/index.js';
import { initializeStreamingServer } from './apis/api-yy/streaming.js';
import app from './file/index.js';
import { Sub } from '@tensorflow/tfjs-node';

export const serverLogger = new Logger('server', 'gray', false);
export const v12ServerLogger = new Logger('server_v12', 'gray', false);

// Init app
const app_yy = new Koa(); //yoiyami v6
const app_mkv12 = new Koa(); //Misskey v12 Compatible

//Configure yoiyami v6 -------------------------------------

app_yy.proxy = true;

if (!['production', 'test'].includes(process.env.NODE_ENV || '')) {
	// Logger
	app_yy.use(koaLogger(str => {
		serverLogger.info(str);
	}));

	// Delay
	if (envOption.slow) {
		app_yy.use(slow({
			delay: 3000,
		}));
	}
}

// HSTS
// 6months (15552000sec)
if (config.url.startsWith('https') && !config.disableHsts) {
	app_yy.use(async (ctx, next) => {
		ctx.set('strict-transport-security', 'max-age=15552000; preload');
		await next();
	});
}

app_yy.use(mount('/api', apiServer_yy));
app_yy.use(mount('/files', fileServer));
app_yy.use(mount('/proxy', proxyServer));

// Init router
const router = new Router();

// Routing
router.use(activityPub.routes());
router.use(nodeinfo.routes());
router.use(wellKnown.routes());

router.get('/avatar/@:acct', async ctx => {
	const { username, host } = Acct.parse(ctx.params.acct);
	const user = await Users.findOne({
		where: {
			usernameLower: username.toLowerCase(),
			host: (host == null) || (host === config.host) ? IsNull() : host,
			isSuspended: false,
		},
		relations: ['avatar'],
	});

	if (user) {
		ctx.redirect(Users.getAvatarUrlSync(user));
	} else {
		ctx.redirect('/static-assets/user-unknown.png');
	}
});

router.get('/identicon/:x', async ctx => {
	const [temp, cleanup] = await createTemp();
	await genIdenticon(ctx.params.x, fs.createWriteStream(temp));
	ctx.set('Content-Type', 'image/png');
	ctx.body = fs.createReadStream(temp).on('close', () => cleanup());
});

router.get('/verify-email/:code', async ctx => {
	const profile = await UserProfiles.findOneBy({
		emailVerifyCode: ctx.params.code,
	});

	if (profile != null) {
		ctx.body = 'Verify succeeded!';
		ctx.status = 200;

		await UserProfiles.update({ userId: profile.userId }, {
			emailVerified: true,
			emailVerifyCode: null,
		});

		publishMainStream(profile.userId, 'meUpdated', await Users.pack(profile.userId, { id: profile.userId }, {
			detail: true,
			includeSecrets: true,
		}));
	} else {
		ctx.status = 404;
	}
});

// Register router
app_yy.use(router.routes());

app_yy.use(mount(webServer));

function createServer() {
	return http.createServer(app_yy.callback());
}

// For testing
export const startServer = () => {
	const server = createServer();

	initializeStreamingServer(server);

	server.listen(config.port);

	return server;
};

export default () => new Promise(resolve => { // TODO: namedなexportにするべきかも
	const server = createServer();

	initializeStreamingServer(server);

	server.on('error', e => {
		switch ((e as any).code) {
			case 'EACCES':
				serverLogger.error(`You do not have permission to listen on port ${config.port}.`);
				break;
			case 'EADDRINUSE':
				serverLogger.error(`Port ${config.port} is already in use by another process.`);
				break;
			default:
				serverLogger.error(e);
				break;
		}

		if (cluster.isWorker) {
			process.send!('listenFailed');
		} else {
			// disableClustering
			process.exit(1);
		}
	});

	server.listen(config.port, resolve);
});

//yoiyami v6 -------------------------------------

//Configure Misskey v12 Compatible Server -------- (app_mkv12)

app_mkv12.proxy = true;

if(!['producton', 'test'].includes(process.env.NODE_ENV || '')) {

	//Logger
	app_mkv12.use(koaLogger(str => {
		v12ServerLogger.info(str);
	}));

	//Delay
	if(envOption.slow) {
		app_mkv12.use(slow({
			delay: 3000,
		}));
	}
}

// HSTS
// 6months (15552000sec)
if (config.url.startsWith('https') && !config.disableHsts) {
	app.use(async (ctx, next) => {
		ctx.set('strict-transport-security', 'max-age=15552000; preload');
		await next();
	});
}

app.use(mount('/api', apiServer_mkv12));

// Init router
const router_mkv12 = new Router();

// Routing
// router_mkv12.use(activityPub.routes()); //サブドメインで連合しちゃまずいので
// router_mkv12.use(nodeinfo.routes());
router_mkv12.use(wellKnown.routes());

router_mkv12.get('/avatar/@:acct', async ctx => {
	const { username, host } = Acct.parse(ctx.params.acct);
	const user = await Users.findOne({
		where: {
			usernameLower: username.toLowerCase(),
			host: (host == null) || (host === config.host) ? IsNull() : host,
			isSuspended: false,
		},
		relations: ['avatar'],
	});

	if (user) {
		ctx.redirect(Users.getAvatarUrlSync(user));
	} else {
		ctx.redirect('/static-assets/user-unknown.png');
	}
});

router_mkv12.get('/identicon/:x', async ctx => {
	const [temp, cleanup] = await createTemp();
	await genIdenticon(ctx.params.x, fs.createWriteStream(temp));
	ctx.set('Content-Type', 'image/png');
	ctx.body = fs.createReadStream(temp).on('close', () => cleanup());
});

// Email認証はyoiyamiのほうでやってほしい

app_mkv12.use(router_mkv12.routes());

// app.use(mount(webServer)); //まだ実装してないので

function createCompatibleServer_v12() {
	return http.createServer(app_mkv12.callback());
}

// For testing?
export const startCompatibleServer_v12 = () => {
	const server = createCompatibleServer_v12();

	initializeStreamingServer(server);

	server.listen(3001); //TODO: configに移動

	return server;
}

export const bootupCompatibleServer_v12 = () => new Promise(resolve => {
	const server = createCompatibleServer_v12();

	// initializeStreamingServer(server); //未実装

	server.on('error', e => {
		switch ((e as any).code) {
			case 'EACCES':
				v12ServerLogger.error(`!!!You do not have permission to listen on port ${config.port}.`);
				break;
			case 'EADDRINUSE':
				v12ServerLogger.error(`!!!Port ${config.port} is already in use by another process.`);
				break;
			default:
				v12ServerLogger.error(e);
				break;
		}

		if (cluster.isWorker) {
			process.send!('listenFailed');
		} else {
			// disableClustering
			process.exit(1);
		}
	});

	const SubPort: Number = 3001; //TODO: configに移動

	server.listen(SubPort, resolve); //TODO: 3001は仮(まだConfigをいじってないので)
});
