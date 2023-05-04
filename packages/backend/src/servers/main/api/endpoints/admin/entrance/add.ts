import { Entrances } from '@/models/index.js';
import define from '../../../define.js';
import { ApiError } from '../../../error.js';
import { Entrance } from '@/models/entities/entrance.js';
import { genId } from '@/misc/gen-id.js';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireAdmin: true,
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		name: {
			type: 'string',

		},
		backgroundUrl: {
			type: 'string',

		},
		registerWindowMarginRight: {
			type: 'string',

		},
		registerWindowMarginBottom: {
			type: 'string',

		},
		registerWindowMarginLeft: {
			type: 'string',

		},
		registerWindowMarginTop: {
			type: 'string',

		},
		registerWindowType: {
			type: 'integer',

		},
	},
	required: ['name', 'backgroundUrl', 'registerWindowMarginRight', 'registerWindowMarginBottom', 'registerWindowMarginLeft', 'registerWindowMarginTop', 'registerWindowType'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps) => {
	const newData = new Entrance(); //くみたて
	newData.id = genId();
	newData.name = ps.name;
	newData.backgroundUrl = ps.backgroundUrl;
	newData.registerWindowMarginRight = ps.registerWindowMarginRight;
	newData.registerWindowMarginBottom = ps.registerWindowMarginBottom;
	newData.registerWindowMarginLeft = ps.registerWindowMarginLeft;
	newData.registerWindowMarginTop = ps.registerWindowMarginTop;
	newData.registerWindowType = ps.registerWindowType;
	
	await Entrances.save(newData); //挿入

	return {
		id: newData.id,
	};
});
