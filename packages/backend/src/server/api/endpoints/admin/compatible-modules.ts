import contentDisposition from 'content-disposition';
import * as os from 'node:os';
import { dirname } from 'node:path';
import define from '../../define.js';
import * as fs from 'node:fs';

export const meta = {

	res: { //TODO: なおす
		type: 'object',
		optional: false, nullable: false,
		properties: {
			module_name: {
				type: 'string',
				optional: false, nullable: false,
			},
			compatible_version: {
				type: 'string',
				optional: false, nullable: false,
			},
			repository: {
				type: 'string',
				optional: false, nullable: false,
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async () => {
	// おためしハードコーディング
	const modules = [
		'/home/romcat/yoiyami/packages/client/src/components/compatible/v13/meta.json',
	];

	async function getMeta(modules: string[]): Promise<any> {
		let res = {};
		
		for (const moduleMetaPath of modules) {
			const parsedMeta = JSON.parse(fs.readFileSync(moduleMetaPath, 'utf8'));
			const module = {
				module_name: parsedMeta.module_name,
				repository: parsedMeta.repository,
				compatible_version: parsedMeta.compatible_version,
				compatible_commit: parsedMeta.compatible_commit,
			};
			res = Object.assign(res, module);
		}
		return res;
	}

	return await getMeta(modules);
});

