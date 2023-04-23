import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as os from 'node:os';
import cluster from 'node:cluster';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import semver from 'semver';

import Logger from '@/services/logger.js';
import loadConfig from '@/config/load.js';
import { Config } from '@/config/types.js';
import { lessThan } from '@/prelude/array.js';
import { envOption } from '../env.js';
import { showMachineInfo } from '@/misc/show-machine-info.js';
import { db, initDb } from '../db/postgre.js';

import { redisClient } from '@/db/redis.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const meta = JSON.parse(fs.readFileSync(`${_dirname}/../../../../built/meta.json`, 'utf-8'));
//うまく取得する方法がまだわからないので暫定でpackage.jsonから直接取得しちゃってる（起動中に編集されたらたぶんこわれる）
const package_json = JSON.parse(fs.readFileSync(`${_dirname}/../../../../package.json`, 'utf-8'));

const logger = new Logger('core', 'cyan');
const bootLogger = logger.createSubLogger('boot', 'magenta', false);

const themeColor = chalk.hex('#86b300');

function greet() {
	if (!envOption.quiet) {
		//#region Misskey logo
		const v = `v${meta.version}`;
		const yy_v = `${package_json.yy_version}`;
		// console.log(themeColor('  _____ _         _           '));
		// console.log(themeColor(' |     |_|___ ___| |_ ___ _ _ '));
		// console.log(themeColor(' | | | | |_ -|_ -| \'_| -_| | |'));
		// console.log(themeColor(' |_|_|_|_|___|___|_,_|___|_  |'));
		// console.log(' ' + chalk.gray(v) + themeColor('                        |___|\n'.substr(v.length)));
		//#endregion

		console.log(themeColor('                #                        #'));
		console.log(themeColor('                                          '));
		console.log(themeColor('  #   #   ###   # #   #  ####  #### ###  #'));
		console.log(themeColor('   #  #  #   #  #  #  #     #  #  ##  #  #'));
		console.log(themeColor('   #  #  #   #  #  #  #  ####  #   #  #  #'));
		console.log(themeColor('   # #   #   #  #  # #   #  #  #   #  #  #'));
		console.log(themeColor('    ##   #   #  #   ##  ##  #  #   #  #  #'));
		console.log(themeColor('    ##    ###   #   ##   ####  #   #  #  #'));
		console.log(themeColor('    #               #                     '));
		console.log(themeColor('    #               #  ' + chalk.gray(yy_v)));
		console.log(themeColor('  ##              ##   ' + chalk.gray('based on Misskey ' + v)));
		console.log('');

		// console.log(' Misskey is an open-source decentralized microblogging platform.');
		console.log(' yoiyami is a fork of Misskey.');
		console.log(chalk.rgb(255, 136, 0)(' If you like this fork, please donate to support Misskey development. https://www.patreon.com/syuilo'));
		console.log(chalk.gray(' Original Misskey repository: https://github.com/misskey-dev/misskey'));

		console.log('');
		console.log(chalkTemplate`--- ${os.hostname()} {gray (PID: ${process.pid.toString()})} ---`);
	}

	bootLogger.info('Welcome to yoiyami!');
	bootLogger.info(`Version : yoiyami ${package_json.yy_version}`, null, true);
	bootLogger.info(`Based on: Misskey v${meta.version}`, null, true);
}

/**
 * Init master process
 */
export async function masterMain() {
	let config!: Config;

	// initialize app
	try {
		greet();
		showEnvironment();
		await showMachineInfo(bootLogger);
		showNodejsVersion();
		config = loadConfigBoot();
		await connectDb();
	} catch (e) {
		bootLogger.error('Fatal error occurred during initialization', null, true);
		process.exit(1);
	}

	bootLogger.succ('yoiyami initialized!');


	// とりあえず隠しとく（最終的にはここでconfigを読み込む)
	// if (!envOption.disableClustering) { 
	// 	await spawnWorkers(config.clusterLimit);
	// }
	await spawnWorkers(); //ワーカー起動するやつ

	bootLogger.succ(`Now listening on port ${config.port} on ${config.url}`, null, true);

	if (!envOption.noDaemons) {
		import('../daemons/server-stats.js').then(x => x.default());
		import('../daemons/queue-stats.js').then(x => x.default());
		import('../daemons/janitor.js').then(x => x.default());
	}
}

function showEnvironment(): void {
	const env = process.env.NODE_ENV;
	const logger = bootLogger.createSubLogger('env');
	logger.info(typeof env === 'undefined' ? 'NODE_ENV is not set' : `NODE_ENV: ${env}`);

	if (env !== 'production') {
		logger.warn('The environment is not in production mode.');
		logger.warn('DO NOT USE FOR PRODUCTION PURPOSE!', null, true);
	}
}

function showNodejsVersion(): void {
	const nodejsLogger = bootLogger.createSubLogger('nodejs');

	nodejsLogger.info(`Version ${process.version} detected.`);

	const minVersion = fs.readFileSync(`${_dirname}/../../../../.node-version`, 'utf-8').trim();
	if (semver.lt(process.version, minVersion)) {
		nodejsLogger.error(`At least Node.js ${minVersion} required!`);
		process.exit(1);
	}
}

function loadConfigBoot(): Config {
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

const mainworkers:number = 2; //TODO: ハードコーディングをやめる
const v12compatibleworkers:number = 1;

// async function spawnWorkers(limit: number = 1) { //TODO
// 	const workers = Math.min(limit, os.cpus().length);
// 	bootLogger.info(`Starting ${workers} worker${workers === 1 ? '' : 's'}...`);
// 	await Promise.all([...Array(workers)].map(spawnWorker));
// 	bootLogger.succ('All workers started');
// }

async function spawnWorkers() {
	bootLogger.info(`Loaded worker configuration:`);
	bootLogger.info(`  Main worker          : ${mainworkers}`);
	bootLogger.info(`  v12 compatible worker: ${v12compatibleworkers}`);
	// 設定値の有効性チェック
	bootLogger.info(`Detected: ${os.cpus().length} CPU thread(s)`);
	const totalWorkers = mainworkers + v12compatibleworkers;
	if (os.cpus().length < totalWorkers) {
		bootLogger.error(`Invalid Configuretion detected!!`);
		bootLogger.error(`The number of configured Workers exceeds the number of CPU threads detected.`);
		if (2 <= os.cpus().length) { // CPU threadが2つ以上あったら最低限の設定で起動する(MainWorker:1, v12CompatibleWorker:1)
			bootLogger.warn(`Please change the number of workers in the configuration file.`);
			bootLogger.info(`yoiyami starts in a minimum configuration of multi-worker mode.`);
		}
		else { // CPU threadが1以下の場合はマルチワーカーで起動できないので終了する(シングルワーカーモードの場合はリバースプロキシの設定を変える必要があるので)
			bootLogger.error(`Cannot start yoiyami in this environment.`);
			bootLogger.error(`Please change the number of workers in the configuration file.`);
			bootLogger.error(`Or, use single-worker mode.`);
			process.exit(1);
		}
	}
	else { //ワーカー起動するやつ
		// MainWorkerの起動
		bootLogger.info(`Starting Main Worker(s)...`);
		await Promise.all([...Array(mainworkers)].map(spawnWorker));
	}
}

function spawnWorker(): Promise<void> {
	return new Promise(res => {
		const worker = cluster.fork();
		worker.on('message', message => {
			if (message === 'listenFailed') {
				bootLogger.error(`The server Listen failed due to the previous error.`);
				process.exit(1);
			}
			if (message !== 'yoiyami server ready' || message !== 'v12 compatible server ready') return;
			res();
		});
	});
}
