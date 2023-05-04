import cluster from 'node:cluster';
import { initDb } from '@/db/postgre.js';
// import server from '@/server/index.js';
// import initQueue from '@/queue/index.js';

export async function initWorker() {
	await initDb();

	await import('../../servers/main/index.js').then(x => x.default());

	import('../../queue/index.js').then(x => x.default());
	// await server();
	// initQueue();

	if (cluster.isWorker) {
		process.send!('worker-ready');
	}
}
