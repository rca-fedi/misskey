import * as fs from 'node:fs';
import * as os from 'node:os';
import * as child_process from 'child_process';
import chalk from 'chalk';
import Logger from '@/services/logger.js';
import { envOption } from '../env.js';
import { initDb, db } from '@/db/postgre.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// TypeORM
import 'reflect-metadata';

const bootupLogger = new Logger('boot', 'cyan');
const exitLogger = new Logger('exit', 'red');

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

//うまく取得する方法がまだわからないので暫定でpackage.jsonから直接取得しちゃってる（起動中に編集されたらたぶんこわれる）
// 古いのから一旦そのまま持ってきているので、このへんのロジックは大きく変わるかも
const package_json = JSON.parse(fs.readFileSync(`${_dirname}/../../../../package.json`, 'utf-8'));

// Process Manager
export async function initCore(): Promise<void> {
	greet();
	envInfo();
	await versionInfo();

	const main = child_process.fork('./built/boot/main/index.js');
	const v12c = child_process.fork('./built/boot/v12c/index.js');

	main.on('message', (message) => {
		if (message === 'worker-ready') {
			bootupLogger.info('Main process is ready.');
		}
	});

	v12c.on('message', (message) => {
		if (message === 'worker-ready') {
			bootupLogger.info('v12c process is ready.');
		}
	});
}

function greet(): void {
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

async function versionInfo(): Promise<void> {
	const versionLogger = bootupLogger.createSubLogger('ver', 'pink');
	
	versionLogger.info('Version Information:');

	versionLogger.info(`  yoiyami: ${package_json.version}`);
	versionLogger.info(`  based on: Misskey ${package_json.based_version}`);
	versionLogger.info(`  Node.js: ${process.version}`);
	versionLogger.info('  Database: Connecting...');
	process.stdout.write('\x1b[1F'); //1行上の行頭にカーソル移すやつ（書き変えたいので
	const dbVersion = await getDbVersion();
	versionLogger.info(`  Database: PostgreSQL ${dbVersion}`);
}

function envInfo(): void {
	// 環境情報出すやつ
	const envLogger = bootupLogger.createSubLogger('env', 'yellow');

	envLogger.info('Environment Information:');
	envLogger.info(`  OS: ${os.type()} ${os.release()} ${os.arch()}`);
	envLogger.info(`  CPU: ${os.cpus()[0].model} x ${os.cpus().length}`);
	envLogger.info(`  Memory: ${Math.round(os.freemem() / 1024 / 1024 )}/${Math.round(os.totalmem() / 1024 / 1024 )}MB`);
	envLogger.info(`  Platform: ${process.platform}`);
	envLogger.debug(`  PID: ${process.pid}`);
	envLogger.debug(`  PWD: ${process.cwd()}`);
	envLogger.debug(`  ExecPath: ${process.execPath}`);
}

async function getDbVersion(): Promise<string> {
	try {
		await initDb();
		const v = await db.query('SHOW server_version').then(x => x[0].server_version);
		return v;
	} catch (e) {
		bootupLogger.error('Database connection failed...', null, true);
		bootupLogger.error(e);
		process.exit(1);
	}
}

// Dying away...
process.on('exit', code => {
	exitLogger.info(`The process is going to exit with code ${code}`);
});
