import * as os from 'node:os';
import * as child_process from 'child_process';
import chalk from 'chalk';
import Logger from '@/services/logger.js';
import { envOption } from '../env.js';
import { initDb, db } from '@/db/postgre.js';

// TypeORM
import 'reflect-metadata';

const bootupLogger = new Logger('boot', 'cyan');
const exitLogger = new Logger('exit', 'red');

// Process Manager
export async function initCore(): Promise<void> {
	greet();
	envInfo();
	await connectDb();

	const main = child_process.fork('./built/boot/main/index.js');

	main.on('message', (message) => {
		if (message === 'worker-ready') {
			bootupLogger.info('Main process is ready.');
		}
	});
}

function greet() {
	console.log(chalk.green('yoiyami Core process initializing...'));

	console.log(chalk.hex('#FF80C0')('   :::   :::       ::::::::       :::::::::::    :::   :::           :::          :::   :::       :::::::::::'));
	console.log(chalk.hex('#FF80C0')('  :+:   :+:      :+:    :+:          :+:        :+:   :+:         :+: :+:       :+:+: :+:+:          :+:'));
	console.log(chalk.hex('#FF80C0')('  +:+ +:+       +:+    +:+          +:+         +:+ +:+         +:+   +:+     +:+ +:+:+ +:+         +:+'));
	console.log(chalk.hex('#FF80C0')('  +#++:        +#+    +:+          +#+          +#++:         +#++:++#++:    +#+  +:+  +#+         +#+'));
	console.log(chalk.hex('#FF80C0')('  +#+         +#+    +#+          +#+           +#+          +#+     +#+    +#+       +#+         +#+'));
	console.log(chalk.hex('#FF80C0')(' #+#         #+#    #+#          #+#           #+#          #+#     #+#    #+#       #+#         #+#'));
	console.log(chalk.hex('#FF80C0')('###          ########       ###########       ###          ###     ###    ###       ###     ###########'));
	// Greet design by @cat@kokuzei.cyou
	// TODO: つくる
}

function envInfo() {
	// 環境情報出すやつ
	const envLogger = bootupLogger.createSubLogger('env', 'yellow');

	envLogger.info('Environment Information:');
	envLogger.info(`  Node.js: ${process.version}`);
	envLogger.info(`  OS: ${os.type()} ${os.release()} ${os.arch()}`);
	envLogger.info(`  CPU: ${os.cpus()[0].model} x ${os.cpus().length}`);
	envLogger.info(`  Memory: ${Math.round(os.freemem() / 1024 / 1024 )}/${Math.round(os.totalmem() / 1024 / 1024 )}MB`);
	envLogger.info(`  Platform: ${process.platform}`);
	envLogger.debug(`  PID: ${process.pid}`);
	envLogger.debug(`  PWD: ${process.cwd()}`);
	envLogger.debug(`  ExecPath: ${process.execPath}`);
}

async function connectDb(): Promise<void> {
	const dbLogger = bootupLogger.createSubLogger('db');

	// Try to connect to DB
	try {
		dbLogger.info('Connecting...');
		await initDb();
		const v = await db.query('SHOW server_version').then(x => x[0].server_version);
		dbLogger.succ(`Connected: v${v}`);
	} catch (e) {
		dbLogger.error('Cannot connect', null, true);
		dbLogger.error(e);
		process.exit(1);
	}
}
// Dying away...
process.on('exit', code => {
	exitLogger.info(`The process is going to exit with code ${code}`);
});
