import * as child_process from 'child_process';
import * as os from 'node:os';
import chalk from 'chalk';
import Xev from 'xev';

import Logger from '@/services/logger.js';

// for typeorm
import 'reflect-metadata';

const logger = new Logger('core', 'cyan');
const clusterLogger = logger.createSubLogger('cluster', 'orange', false);
const masterLogger = new Logger('master', 'blue');
const ev = new Xev();

// Start core process
export async function initManager() {
// 検証用Config (TODO: Configファイルに移す)
	const v12Compatible = true;

	greet();
	envInfo();

	// 各プライマリプロセスの起動-------------------------------------------
	// Master-Primary
	const master = child_process.fork('./built/boot/master/index.js', [], {});

	// v12c-Primary
	// const v12c = child_process.fork('./built/boot/v12-compatible/index.js', [], {});

	// Message Listener
	master.on('message', (msg) => {
		if (msg === 'primary-ready') {
			masterLogger.info('Master-Primary is ready!');
		}
	});
	master.on('message', (msg) => {
		if (msg === 'worker-ready') {
			masterLogger.info('Master-Worker is ready!');
		}
	});

	// v12c.on('message', (msg) => {
	// 	if (msg === 'primary-ready') {
	// 		masterLogger.info('v12c-Primary is ready!');
	// 	}
	// });
	// v12c.on('message', (msg) => {
	// 	if (msg === 'worker-ready') {
	// 		masterLogger.info('v12c-Worker is ready!');
	// 	}
	// });

	//--------------------------------------------------------------------
}

// 起動ログ
function greet() {
	console.log(chalk.green("Starting yoiyami master process..."));
	// いい感じのロゴを出したい
}

// システム情報
function envInfo() {
	logger.info('Environment Info:');
	logger.info(`  CPU: ${os.cpus()[0].model}`);
	logger.info(`    Arch: ${os.arch()}`);
	logger.info(`  Memory: ${os.freemem}/${os.totalmem}`);
	//  もうちょっといろいろだしたい
}

function checkProcessConfig() {

}

//#region Events
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
