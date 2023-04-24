import cluster from 'node:cluster';
import * as child_process from 'child_process';
import chalk from 'chalk';
import Xev from 'xev';
import * as os from 'node:os';

import Logger from '@/services/logger.js';
import * as MasterPrimary from '@/boot/master/primary.js';
import { envOption } from '../env.js';

// for typeorm
import 'reflect-metadata';
import { masterMain } from './master.js';
import { initializeWorkers } from './worker.js';
import { redisClient } from '@/db/redis.js';
import { osInfo } from 'systeminformation';
import { ChildProcess } from 'node:child_process';

const logger = new Logger('core', 'cyan');
const clusterLogger = logger.createSubLogger('cluster', 'orange', false);
const masterLogger = new Logger('master', 'blue');
const ev = new Xev();

// Start Manager process
export default async function() {
// 検証用Config (TODO: Configファイルに移す)
	const v12Compatible = true;

	greet();
	envInfo();

	// 各プライマリプロセスの起動

	// const child_process = require('child_process');

	// Master-Primary
	const master = child_process.fork('./built/boot/master/primary.js', [], {});
	
	// Message Listener
	master.on('message', (msg) => {
		if (msg === 'master_ready') {
			masterLogger.info('Master-Primary is ready!');
		}
	});

	// 起動ログ
	function greet() {
		console.log(chalk.green("Starting yoiyami master process..."));
		// いい感じのロゴを出したい
	}

	// システム情報
	function envInfo() {
		logger.info("Environment Info:");
		logger.info(`		CPU: `+os.cpus()[0].model);
		//  もうちょっといろいろだしたい
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
