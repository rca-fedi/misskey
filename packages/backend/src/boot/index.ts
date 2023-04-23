import cluster from 'node:cluster';
import chalk from 'chalk';
import Xev from 'xev';

import Logger from '@/services/logger.js';
import { envOption } from '../env.js';

// for typeorm
import 'reflect-metadata';
import { masterMain } from './master.js';
import { initializeWorkers } from './worker.js';
import { redisClient } from '@/db/redis.js';

const logger = new Logger('core', 'cyan');
const clusterLogger = logger.createSubLogger('cluster', 'orange', false);
const ev = new Xev();

/**
 * Init process
 */
export default async function() {

	//TOOD: configファイルに移す(メモ用)
	const singleProcessMode: boolean = false;

	process.title = `Misskey (${cluster.isPrimary ? 'master' : 'worker'})`;

	// if(singleProcessMode) {
	// 	process.title = `yoiyami_sp (${cluster.isPrimary ? 'master' : 'worker'})`; //Single Process Mode //未実装
	// }
	// else {
	// 	if(cluster.)
	// }

	
	if (cluster.isPrimary || envOption.disableClustering) {
		await masterMain();

		if (cluster.isPrimary) {
			ev.mount();
		}
	}

	if (cluster.isWorker || envOption.disableClustering) {
		await initializeWorkers();
	}

	// ユニットテスト時にMisskeyが子プロセスで起動された時のため
	// それ以外のときは process.send は使えないので弾く
	if (process.send) {
		process.send('ok');
	}
}

//#region Events

// Listen new workers
cluster.on('fork', worker => {
	clusterLogger.debug(`Process forked: [WorkerID:${worker.id}]`);
});

// Listen online workers
cluster.on('online', worker => {
	clusterLogger.debug(`Process is now online: [WorkerID:${worker.id}]`);
});

// Listen for dying workers
cluster.on('exit', worker => {
	// Replace the dead worker,
	// we're not sentimental
	clusterLogger.error(chalk.red(`[${worker.id}] died :(`));
	cluster.fork();
});

// Display detail of unhandled promise rejection
if (!envOption.quiet) {
	process.on('unhandledRejection', console.dir);
}

// Display detail of uncaught exception
process.on('uncaughtException', err => {
	try {
		logger.error(err);
	} catch { }
});

// Dying away...
process.on('exit', code => {
	logger.info(`The process is going to exit with code ${code}`);
});

//#endregion
