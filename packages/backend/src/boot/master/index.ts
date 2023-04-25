import cluster from "node:cluster";
import Logger from '@/services/logger.js';
import * as masterPrimary from './primary.js';
import * as masterWorker from './worker.js';

init();
const masterLogger = new Logger("master", "cyan");


// 起動判定とかする
async function init() {
	const masterLogger = new Logger("master", "cyan");

	if (cluster.isPrimary) {
		await masterPrimary.masterMain();
		process.send!('primary-ready');
	}
	if (cluster.isWorker) {
		await masterWorker.workerMain();
	}
}

if (cluster.isPrimary) {
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
}

