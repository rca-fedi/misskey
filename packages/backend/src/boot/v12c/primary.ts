import * as os from 'node:os';
import cluster from 'node:cluster';
import Logger from '@/services/logger.js';
import loadConfig from '@/config/load.js';
import { Config } from '@/config/types';
import { envOption } from '../../env.js';
import { initDb } from '@/db/postgre.js';

const logger = new Logger('main', 'purple');
const bootLogger = logger.createSubLogger('boot', 'orange', false);

export async function initPrimary() {
	let config!: Config;

	try {
		bootLogger.info('Booting...');
		config = loadConfigBoot();
		initDb(); //ないとプロセス終了しちゃう...？（そんなことないかも、まだ監視できてない）
	}
	catch (e) {
		bootLogger.error('Cannot boot', null, true);
		bootLogger.error(e);
		process.exit(1);
	}

	bootLogger.succ('Check point 1 passed');
 
	if (!envOption.disableClustering) {
		await spawnWorkers(config.clusterLimit);
	}

	if (!envOption.noDaemons) {
		import('@/daemons/server-stats.js').then(x => x.default());
		import('@/daemons/queue-stats.js').then(x => x.default());
		import('@/daemons/janitor.js').then(x => x.default());
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

async function spawnWorkers(limit: number = 1) {
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
				bootLogger.error(`The server Listen failed due to the previous error.`);
				process.exit(1);
			}
			if (message !== 'worker-ready') return;
			res();
		});
	});
}
