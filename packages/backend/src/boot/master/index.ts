import cluster from 'node:cluster';

import Logger from '@/services/logger.js';
import * as masterPrimary from './primary.js';
import * as masterWorker from './worker.js';
const masterLogger = new Logger("master", "cyan");
import { envOption } from '../../env.js';
import 'reflect-metadata';

init();

// 起動判定とかする
async function init() {
	const masterLogger = new Logger("master", "cyan");

	process.title = `yoiyami (${cluster.isPrimary ? 'master' : 'worker'})`;

	if (cluster.isPrimary || envOption.disableClustering) {
		await masterPrimary.masterMain();
		process.send!('primary-ready');
	}
	if (cluster.isWorker || envOption.disableClustering) {
		await masterWorker.workerMain();
	}
}

// Listen new workers
cluster.on('fork', worker => {
	masterLogger.debug(`MASTERRRRRRRProcess forked: [WorkerID:${worker.id}]`);
});

// Listen online workers
cluster.on('online', worker => {
	// bootLogger.debug(`Process is now online: [WorkerID:${worker.id}]`);
	process.send!("worker-ready");
});

// Listen for dying workers
cluster.on('exit', worker => {
	// Replace the dead worker,
	// we're not sentimental
	// bootLogger.error(chalk.red(`[${worker.id}] died :(`));
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
