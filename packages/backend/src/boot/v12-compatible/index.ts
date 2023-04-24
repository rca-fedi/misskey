import cluster from "node:cluster";
import Logger from '@/services/logger.js';
import * as masterPrimary from './primary.js';
import * as masterWorker from './worker.js';

init();
// 起動判定とかする
async function init() {
	const masterLogger = new Logger("master", "cyan");

	if (cluster.isPrimary) {
		await masterPrimary.masterMain();
		process.send!('primary-ready');
	}
	if (cluster.isWorker) {
		masterWorker.workerMain();
	}
}
