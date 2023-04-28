import cluster from 'node:cluster';
import Logger from '@/services/logger.js';

import { initDb } from '../../db/postgre.js';

export async function workerMain(): Promise<void> {
	await initDb();

	// start server
	await import('../../server/index-v12c.js').then(x => x.default());

	// start job queue
	import('../../queue-old/index.js').then(x => x.default());

	if (cluster.isWorker) {
		// Send a 'ready' message to parent process
		process.send!('worker-ready');
	}
}
