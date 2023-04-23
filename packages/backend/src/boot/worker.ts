import cluster from 'node:cluster';
import { initDb } from '../db/postgre.js';
import Logger from '@/services/logger.js';

import { redisClient } from '@/db/redis.js';

/**
 * Init worker process
 */

export async function initializeWorkers() { //Redisから起動する必要があるワーカーの数を取得して、その数だけワーカーを起動するやつ

	const logger = new Logger('core', 'cyan');
	const clusterLogger = logger.createSubLogger('cluster', 'orange', false);

	let mainworkers = 0;
	let v12compatibleworkers = 0;
	let mainworkers_booted = 0;
	let v12compatibleworkers_booted = 0;

	redisClient.get(mainworkers, (err, reply) => {
		if (err) {
			console.log(err);
		} else {
			mainworkers = Number(reply);
			console.log("Main "+mainworkers);
		}
	});
	redisClient.get(mainworkers_booted, (err, reply) => {
		if (err) {
			console.log(err);
		} else {
			mainworkers_booted = Number(reply);
			console.log("Main Booted "+mainworkers_booted);
		}
	});

	if ((mainworkers_booted as Number) < (mainworkers as Number)) {
		clusterLogger.info(`Booting main worker: ${mainworkers_booted + 1}/${mainworkers}`);
		workerMain();
		redisClient.set(mainworkers_booted, mainworkers_booted + 1)

	}
	else { //mainworkerが起動しきってないときにv12compatibleworkerの数とっても意味ないので（効率化？
		redisClient.get(v12compatibleworkers, (err, reply) => {
			if (err) {
				console.log(err);
			} else {
				v12compatibleworkers = Number(reply);
				console.log("V12 "+v12compatibleworkers);
			}
		});
		redisClient.get(v12compatibleworkers_booted, (err, reply) => {
			if (err) {
				console.log(err);
			} else {
				v12compatibleworkers_booted = Number(reply);
				console.log("v12 Booted "+ v12compatibleworkers_booted);
			}
		});
		clusterLogger.info(`Booting v12 compatible worker: ${v12compatibleworkers_booted + 1}/${v12compatibleworkers}`);
		workerV12();
		redisClient.set(v12compatibleworkers_booted, v12compatibleworkers_booted + 1)
	}
}

async function initDb() {


async function workerMain() {
	await initDb();

	// start server
	await import('../server/index.js').then(x => x.default());


	// start job queue
	import('../queue/index.js').then(x => x.default());

	if (cluster.isWorker) {
		// Send a 'ready' message to parent process
		process.send!('yoiyami server ready');
	}

	return "success";
}

async function workerV12() { //v12 compatible server
	await initDb();

	await import('../server/index.js').then(x => x.bootupCompatibleServer_v12); //v12 compatible server

	import('../queue/index.js').then(x => x.default());

	if (cluster.isWorker) {
		// Send a 'ready' message to parent process
		process.send!('v12 compatible server ready');
	}

	return "success";
}
