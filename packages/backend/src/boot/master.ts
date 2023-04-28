import * as child_process from 'child_process';
import * as os from 'node:os';
import chalk from 'chalk';
import Xev from 'xev';

import Logger from '@/services/logger.js';

// for typeorm
import 'reflect-metadata';

// Loggerの作成
const logger = new Logger('bootup', 'cyan', 'core');
const masterlogger = logger.createSubLogger('master', 'green'); 

const ev = new Xev();

// Start core process
export async function initManager() {
// 検証用Config (TODO: Configファイルに移す)
	const v12Compatible = true;

	// await bootProgrss();
	greet();
	envInfo();

	// 各プライマリプロセスの起動-------------------------------------------
	// Master-Primary
	const master = child_process.fork('./built/boot/master/index.js', [], {});

	// v12c-Primary
	// const v12c = child_process.fork('./built/boot/v12-compatible/index.js', [], {});

	// Message Listener
	master.on('message', (msg) => {
		if (msg === 'group-ready') {
			masterlogger.succ('Master Group is ready!', null, true);
		}
	});
	master.on('message', (msg) => {
		if (msg === 'worker-ready') {
			masterlogger.succ('Master-Worker is ready!');
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

async function bootProgrss() {
	// debuglogger
	const coreDebugLogger = logger.createSubLogger('debug', 'yellow');

	coreDebugLogger.debug("TermInfo: ");
	coreDebugLogger.debug(`  WindowSize: ${process.stdout.getWindowSize()}`);
	coreDebugLogger.debug(`横幅のテスト`);
	console.log('□'.repeat(process.stdout.getWindowSize()[0]));
	process.stdout.write('□'.repeat(process.stdout.getWindowSize()[0]));
	for (let i = 0; i <= process.stdout.getWindowSize()[0]; i++) {
		process.stdout.write('■'.repeat(i) + '\r');
		// 100ms待機
		await new Promise(resolve => setTimeout(resolve, 100));
	}
}
