import * as os from 'node:os';
import cluster from 'node:cluster';
import Logger from '@/services/logger.js';
import loadConfig from '@/config/load.js';
import { Config } from '@/config/types';
import { initDb } from '@/db/postgre.js';
import { envOption } from '../../env.js';
import { initWorker } from './worker.js';

const logger = new Logger('main', 'purple');
const bootLogger = logger.createSubLogger('boot', 'orange', false);
let bootConfig: Config;

export async function initPrimary(): Promise<void> {
	bootConfig = loadConfig();

	try {
		bootLogger.info('Booting...');
		initDb(); //ないとプロセス終了しちゃう...？（そんなことないかも、まだ監視できてない）
	}
	catch (e) {
		if (e instanceof Error || typeof e === 'string') {
			bootLogger.error('Cannot boot', null, true);
			bootLogger.error(e);
			process.exit(1);
		}
		else {
			bootLogger.error('Cannot boot', null, true);
			bootLogger.error('UNKNOWN ERROR!(Error type is not Error or string)');
			process.exit(1);
		}
	}

	bootLogger.succ('initialization completed!');
 
	if (!envOption.disableClustering) {
		if (bootConfig.processes.main === 1) {
			//1プロセスで起動してほしいのでforkせずにWorkerになってもらう
			bootLogger.info('Initiating worker function...');
			initWorker();
			bootLogger.succ('yoiyami main is now listening to ' + bootConfig.main.url + '. (Port: ' + bootConfig.main.port + ')');
		}
		else {
			await spawnWorkers(bootConfig.processes.main);
		}
	}

	if (!envOption.noDaemons) {
		import('@/daemons/server-stats.js').then(x => x.default());
		import('@/daemons/queue-stats.js').then(x => x.default());
		import('@/daemons/janitor.js').then(x => x.default());
	}
}

async function spawnWorkers(limit = 1): Promise<void> {
	const workers = Math.min(limit, os.cpus().length);
	bootLogger.info(`Starting ${workers} worker${workers === 1 ? '' : 's'}...`);
	await Promise.all([...Array(workers)].map(spawnWorker));
	bootLogger.succ('All workers started');
	bootLogger.succ('yoiyami main is now listening to ' + bootConfig.main.url + '. (Port: ' + bootConfig.main.port + ')');
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
