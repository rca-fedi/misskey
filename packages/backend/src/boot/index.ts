import cluster from 'node:cluster';
import * as yyManger from './master.js';

export default async function() {
	//Manager Process Entry Point?
	if (cluster.isPrimary) {
		await yyManger.initManager();
	}
}
