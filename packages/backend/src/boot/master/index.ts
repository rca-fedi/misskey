import cluster from 'node:cluster';

import Logger from '@/services/logger.js';
import * as masterPrimary from './primary.js';
import * as masterWorker from './worker.js';
import { envOption } from '../../env.js';
import 'reflect-metadata';

//logger
const masterLogger = new Logger("master", "cyan", 'master');
const exitLogger = masterLogger.createSubLogger('exit', 'red');
const errorLogger = masterLogger.createSubLogger('error', 'red');

init();

// 起動判定とかする
async function init() {
	process.title = `yoiyami master (${cluster.isPrimary ? 'master' : 'worker'})`;

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
	masterLogger.debug(`Master process forked: [WorkerID:${worker.id}]`);
});

// Listen online workers
cluster.on('online', worker => {
	masterLogger.debug(`Master process is now online: [WorkerID:${worker.id}]`);
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
		errorLogger.error(err);
	} catch { }
});

// Dying away...
process.on('exit', code => {
	exitLogger.info(`The process is going to exit with code ${code}`);
});

//#endregion
