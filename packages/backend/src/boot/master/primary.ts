import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as os from 'node:os';
import cluster from 'node:cluster';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import semver from 'semver';

import 'reflect-metadata';

import Logger from '@/services/logger.js';
import loadConfig from '@/config/load.js';
import { Config } from '@/config/types.js';
import { lessThan } from '@/prelude/array.js';
import { envOption } from '../../env.js';
import { showMachineInfo } from '@/misc/show-machine-info.js';
import { db, initDb } from '../../db/postgre.js';
import * as workerMain from './worker.js';

// Start primary process
const logger = new Logger('master', 'cyan', 'master');
const bootLogger = logger.createSubLogger('boot', 'green');

export async function masterMain() {
	let config!: Config;

	// initialize app
	try {
		bootLogger.info('Booting...');
		config = loadConfigBoot();
		await connectDb();
	} catch (e) {
		bootLogger.error('Fatal error occurred during initialization', null, true);
		process.exit(1);
	}

	// bootLogger.succ('yoiyami initialized!');


	// とりあえず隠しとく（最終的にはここでconfigを読み込む)
	// if (!envOption.disableClustering) { 
	// 	await spawnWorkers(config.clusterLimit);
	// }

	// await spawnWorkers(); //ワーカー起動するやつ

	if (cluster.isPrimary || envOption.disableClustering) {
		await spawnWorkers(2);
	}
	if (cluster.isWorker || envOption.disableClustering) {
		bootLogger.info('initializing master-primary process for worker...');
		await workerMain.workerMain();
	}

	// bootLogger.succ(`Now listening on port ${config.port} on ${config.url}`, null, true);

	if (!envOption.noDaemons) {
		import('../../daemons/server-stats.js').then(x => x.default());
		import('../../daemons/queue-stats.js').then(x => x.default());
		import('../../daemons/janitor.js').then(x => x.default());
	}
}

function loadConfigBoot(): Config { //TODO: 置き換える
	const configLogger = bootLogger.createSubLogger('config');
	let config;

	try {
		config = loadConfig();
	} catch (exception) {
		if (typeof exception === 'string') {
			configLogger.error(exception);
			process.exit(1);
		}
		if (exception.code === 'ENOENT') {
			configLogger.error('Configuration file not found', null, true);
			process.exit(1);
		}
		throw exception;
	}

	configLogger.succ('Loaded');

	return config;
}

async function connectDb(): Promise<void> {
	const dbLogger = bootLogger.createSubLogger('db');

	// Try to connect to DB
	try {
		dbLogger.info('Connecting...');
		await initDb();
		const v = await db.query('SHOW server_version').then(x => x[0].server_version);
		dbLogger.succ(`Connected: v${v}`);
	} catch (e) {
		dbLogger.error('Cannot connect', null, true);
		dbLogger.error(e);
		process.exit(1);
	}
}

async function spawnWorkers(limit: number = 1) { //TODO
	const workers = Math.min(limit, os.cpus().length);
	bootLogger.info(`Starting ${workers} worker${workers === 1 ? '' : 's'}...`);
	await Promise.all([...Array(workers)].map(spawnWorker));
	bootLogger.succ('All workers started');
}

function spawnWorker(): Promise<void> {
	return new Promise(res => {
		const worker = cluster.fork();
		worker.on('message', message => {
			if (message === 'listenFailed') {
				bootLogger.error('The server Listen failed due to the previous error.');
				process.exit(1);
			}
			if (message !== 'worker-ready') return;
			res();
		});
	});
}

