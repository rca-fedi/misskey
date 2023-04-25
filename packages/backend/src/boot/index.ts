import cluster from 'node:cluster';
import * as yyManger from './manager.js';

export default async function() {
	//Manager Process Entry Point?

	if (cluster.isPrimary) {
		await yyManger.initManager();
		console.log("INIT MANAGER PROCESS");
	}
}
