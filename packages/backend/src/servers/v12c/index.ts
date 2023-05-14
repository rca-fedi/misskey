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
import send from 'koa-send';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import serve from 'koa-static';
import views from 'koa-views';

import { IsNull } from 'typeorm';
import config from '@/config/index.js';
import Logger from '@/services/logger.js';
import { UserProfiles, Users } from '@/models/index.js';
import { genIdenticon } from '@/misc/gen-identicon.js';
import { createTemp } from '@/misc/create-temp.js';
import { publishMainStream } from '@/services/stream.js';
import * as Acct from '@/misc/acct.js';
import { envOption } from '../../env.js';
import wellKnown from './well-known.js';
import apiServer from './api/index.js';
import fileServer from './file/index.js';
import proxyServer from './proxy/index.js';
import webServer from './web/index.js';
import { initializeStreamingServer } from './api/streaming.js';

export const serverLogger = new Logger('server', 'gray', false);

// Init app
const app = new Koa();
app.proxy = true;

if (!['production', 'test'].includes(process.env.NODE_ENV || '')) {
	// Logger
	app.use(koaLogger(str => {
		serverLogger.info(str);
	}));

	// Delay
	if (envOption.slow) {
		app.use(slow({
			delay: 3000,
		}));
	}
}

// HSTS
// 6months (15552000sec)
if (config.v12c.url.startsWith('https') && !config.disableHsts) {
	app.use(async (ctx, next) => {
		ctx.set('strict-transport-security', 'max-age=15552000; preload');
		await next();
	});
}

app.use(mount('/api', apiServer));
app.use(mount('/files', fileServer));
app.use(mount('/proxy', proxyServer));

// Init router
const router = new Router();

// Routing
// router.use(activityPub.routes());
// router.use(nodeinfo.routes());
router.use(wellKnown.routes());

router.get('/avatar/@:acct', async ctx => {
	const { username, host } = Acct.parse(ctx.params.acct);
	const user = await Users.findOne({
		where: {
			usernameLower: username.toLowerCase(),
			host: (host == null) || (host === config.v12c_host) ? IsNull() : host,
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

// yoiyami simple auth client
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

app.use(views(_dirname + '/simple-auth-client', {
	extension: 'pug',
}));

router.get('/auth-assets/(.*)', async ctx => {
	await send(ctx as any, ctx.path.replace('/auth-assets/', ''), {
		root: `${_dirname}/simple-auth-client/auth-assets/`,
	});
});

// miauth

router.get('/miauth/:token', async ctx => {
	const query = ctx.request.query;
	const token = ctx.params.token;
	const callback = query.callback;
	const permission = query.permission ? query.permission : 'Error: permission is not specified.';
	const icon = query.icon;
	const name = query.name;

	console.log(token);
	console.log(query);
	console.log(permission);
	
	await ctx.render('miauth', {
		token: token,
		permissions: permission,
		callback: callback,
		icon: icon,
		name: name,
	});
});

// ------------------------------

// App aurhentication

router.get('/auth/:token', async ctx => {
	// const query = ctx.request.query;
	const token = ctx.params.token;
	// const callback = query.callback;
	// const permission = query.permission ? query.permission : 'Error: permission is not specified.';
	// const icon = query.icon;
	// const name = query.name;

	console.log(token);
	// console.log(query);
	// console.log(permission);
	
	await ctx.render('appauth', {
		token: token,
		// permissions: permission,
		// callback: callback,
		// icon: icon,
		// name: name,
	});
});

// Register router
app.use(router.routes());

// app.use(mount(webServer));

function createServer() {
	return http.createServer(app.callback());
}

// For testing
export const startServer = () => {
	const server = createServer();

	initializeStreamingServer(server);

	server.listen(config.v12c.port);

	return server;
};

export default () => new Promise(resolve => {
	const server = createServer();

	initializeStreamingServer(server);

	server.on('error', e => {
		switch ((e as any).code) {
			case 'EACCES':
				serverLogger.error(`You do not have permission to listen on port ${config.v12c.port}.`);
				break;
			case 'EADDRINUSE':
				serverLogger.error(`Port ${config.v12c.port} is already in use by another process.`);
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

	server.listen(config.v12c.port, resolve); 
});
