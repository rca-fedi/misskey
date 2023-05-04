import cluster from 'node:cluster';
import EventEmitter from 'node:events';
import chalk from 'chalk';
import Xev from 'xev';
import Logger from '@/services/logger.js';
import { envOption } from '../../env.js';
import { initPrimary } from './primary.js';
import { initWorker } from './worker.js';

const logger = new Logger('v12c', 'purple');
const ev = new Xev('main');

initMainGroup();

async function initMainGroup(): Promise<void> {
	process.title = `yoiyami-v12c (${cluster.isPrimary ? 'master' : 'worker'})`;

	EventEmitter.defaultMaxListeners = 50; //リークしてないけど警告出るので

	if (cluster.isPrimary || envOption.disableClustering) {
		logger.debug('Initializing primary process...');
		await initPrimary();

		if (cluster.isPrimary) {
			ev.mount();
		}
	}
	if (cluster.isWorker || envOption.disableClustering) {
		logger.debug('Initializing worker process...');
		await initWorker();
	}
}

// Listen
cluster.on('fork', worker => {
	logger.debug(`Process forked: [${worker.id}]`);
});
cluster.on('online', worker => {
	logger.debug(`Process is now online: [${worker.id}]`);
});
cluster.on('exit', worker => {
	logger.error(chalk.red(`[${worker.id}] died :(`));
	cluster.fork();
});
// Dying away...
process.on('exit', code => {
	logger.info(`The process is going to exit with code ${code}`);
});
