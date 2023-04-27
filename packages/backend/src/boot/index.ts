import cluster from 'node:cluster';
import * as yyManger from './master.js';
import Logger from '../services/logger.js';

const logger = new Logger('core', 'cyan', 'core');
const exitLogger = new Logger('exit', 'red');
const errorLogger = new Logger('error', 'red');

export default async function() {
	//Manager Process Entry Point?
	if (cluster.isPrimary) {
		await yyManger.initManager();
	}
}

//#region Events
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
